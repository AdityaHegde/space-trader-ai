import {BaseService} from "../../BaseService";
import {SurveyEntity} from "./survey.entity";
import {ShipEntity} from "../ships/ship.entity";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {Cache} from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Cooldown} from "../types/Cooldown";
import {getTimeRemaining} from "../../../commons/dateUtils";

export interface SurveyResponse {
  cooldown: Cooldown;
  surveys: Array<SurveyEntity>;
}

export interface Extraction {
  shipSymbol: string;
  yield: {
    tradeSymbol: string;
    units: number;
  };
}
export interface ExtractResponse {
  cooldown: Cooldown;
  extraction: Extraction
}

@Injectable()
export class ExtractionService extends BaseService<SurveyEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    @InjectRepository(SurveyEntity) repository: Repository<SurveyEntity>,
  ) {
    super(httpClient, cacheManager, repository);
  }

  public async survey(ship: ShipEntity): Promise<Array<SurveyEntity>> {
    if (!ship.surveyCooldown?.expiration || getTimeRemaining(ship.surveyCooldown.expiration) <= 0) {
      await this.repository.delete({});
    }
    return this.getAllFromCacheOrFetch(
      ship.location, "signature",
      async () => {
        const resp = await this.httpClient.post<SurveyResponse>(`/my/ships/${ship.symbol}/survey`);
        resp.surveys.forEach(survey => {
          survey.location = ship.location;
        });
        ship.surveyCooldown = resp.cooldown;
        return resp.surveys;
      },
      this.repository.createQueryBuilder("surveys").select()
        .where("surveys.location = :location", {location: ship.location}),
    );
  }
  public async surveyCooldown(ship: ShipEntity): Promise<Cooldown> {
    if (ship.surveyCooldown?.expiration && getTimeRemaining(ship.surveyCooldown.expiration) > 0) {
      return ship.surveyCooldown;
    }

    const resp = await this.httpClient.get<SurveyResponse>(`/my/ships/${ship.symbol}/survey`);
    ship.surveyCooldown = resp.cooldown;
    return resp.cooldown;
  }

  public async extract(ship: ShipEntity, survey: SurveyEntity): Promise<Extraction> {
    const resp = await this.httpClient.post<ExtractResponse>(
      `/my/ships/${ship.symbol}/extract`, {survey: JSON.parse(JSON.stringify(survey))});
    ship.extractCooldown = resp.cooldown;
    return resp.extraction;
  }
  public async extractCooldown(ship: ShipEntity): Promise<Cooldown> {
    const resp = await this.httpClient.get<ExtractResponse>(
      `/my/ships/${ship.symbol}/extract`);
    ship.extractCooldown = resp.cooldown;
    return resp.cooldown;
  }

  protected async fromJson(json: SurveyEntity, survey = new SurveyEntity()): Promise<SurveyEntity> {
    survey.signature = json.signature;
    survey.deposits = json.deposits;
    survey.expiration = json.expiration;
    survey.location = json.location;
    return survey;
  }
}
