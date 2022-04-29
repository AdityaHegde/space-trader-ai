import {BaseService} from "../../BaseService";
import {SurveyEntity} from "./survey.entity";
import type { Cargo, ShipEntity } from "../ships/ship.entity";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Cooldown} from "../types/Cooldown";
import { Cron } from "@nestjs/schedule";
import { CooldownService } from "@space-trader-api/cooldown/cooldown.service";
import { parseLocation } from "@commons/parseLocation";
import { TradeService } from "@space-trader-api/trade/trade.service";

export interface SurveyResponse {
  cooldown: Cooldown;
  surveys: Array<SurveyEntity>;
}

export interface Extraction {
  shipSymbol: string;
  yield: Cargo;
}
export interface ExtractResponse {
  cooldown: Cooldown;
  extraction: Extraction
}

@Injectable()
export class ExtractionService extends BaseService<SurveyEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @InjectRepository(SurveyEntity) repository: Repository<SurveyEntity>,
    private readonly cooldownService: CooldownService,
    private readonly tradeService: TradeService,
  ) {
    super(httpClient, repository);
  }

  public async survey(ship: ShipEntity): Promise<Array<SurveyEntity>> {
    if (!ship.canSurvey()) return [];

    const {system} = parseLocation(ship.location);
    const {importPrices} = await this.tradeService.getPricesInSystem(system);

    const resp = await this.httpClient.post<SurveyResponse>(`/my/ships/${ship.symbol}/survey`);
    const surveys = await Promise.all(resp.surveys.map(survey => {
      survey.location = ship.location;
      survey.price = survey.deposits.reduce(
        (sum, deposit) => sum + (importPrices[deposit] ?? 0), 0
      ) / survey.deposits.length;
      return this.fromJson(survey);
    }));

    ship.surveyCooldown.setCooldown(resp.cooldown);
    await this.cooldownService.upsertSurveyCooldown(ship);

    return this.repository.save(surveys);
  }
  public async surveyCooldown(ship: ShipEntity): Promise<Cooldown> {
    if (!ship.canSurvey()) {
      return ship.surveyCooldown.cooldown;
    }

    const resp = await this.httpClient.get<SurveyResponse>(`/my/ships/${ship.symbol}/survey`);
    ship.surveyCooldown.setCooldown(resp.cooldown);
    return resp.cooldown;
  }

  public async getTopSurvey(location: string): Promise<Array<SurveyEntity>> {
    return this.repository.createQueryBuilder("surveys").select()
      .where(
        "surveys.location = :location AND " +
          "surveys.expiration > TIMESTAMP 'NOW'",
        {location},
      )
      .orderBy("surveys.price", "DESC")
      .limit(1)
      .getMany();
  }

  public async extract(ship: ShipEntity, survey?: SurveyEntity): Promise<Extraction> {
    const resp = await this.httpClient.post<ExtractResponse>(
      `/my/ships/${ship.symbol}/extract`,
      survey ? {survey: JSON.parse(JSON.stringify(survey))} : {},
    );
    ship.extractCooldown.setCooldown(resp.cooldown);
    await this.cooldownService.upsertExtractCooldown(ship);
    return resp.extraction;
  }
  public async extractCooldown(ship: ShipEntity): Promise<Cooldown> {
    const resp = await this.httpClient.get<ExtractResponse>(
      `/my/ships/${ship.symbol}/extract`);
    ship.extractCooldown.setCooldown(resp.cooldown);
    return resp.cooldown;
  }

  @Cron("* * * * * *")
  public async deleteExpiredSurveys(): Promise<void> {
    await this.repository.createQueryBuilder("surveys").select()
      .where("surveys.expiration <= TIMESTAMP 'NOW'").delete()
  }

  protected async fromJson(json: SurveyEntity, survey = new SurveyEntity()): Promise<SurveyEntity> {
    survey.signature = json.signature;
    survey.deposits = json.deposits;
    survey.expiration = json.expiration;
    survey.location = json.location;
    survey.price = json.price;
    return survey;
  }
}
