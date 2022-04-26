import {BaseService} from "../../BaseService";
import {SurveyEntity} from "./survey.entity";
import type { Cargo, ShipEntity } from "../ships/ship.entity";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Cooldown} from "../types/Cooldown";

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
  ) {
    super(httpClient, repository);
  }

  public async survey(ship: ShipEntity): Promise<Array<SurveyEntity>> {
    if (ship.canSurvey()) {
      await this.repository.delete({});
    } else {
      const existingSurveys = await this.repository.createQueryBuilder("surveys").select()
        .where("surveys.location = :location", {location: ship.location}).getMany();
      if (existingSurveys?.length) return existingSurveys;

      return [];
    }

    const resp = await this.httpClient.post<SurveyResponse>(`/my/ships/${ship.symbol}/survey`);
    resp.surveys.forEach(survey => {
      survey.location = ship.location;
    });
    ship.surveyCooldown.setCooldown(resp.cooldown);

    return Promise.all(resp.surveys.map(survey => this.loadEntityFromJson(survey)))
  }
  public async surveyCooldown(ship: ShipEntity): Promise<Cooldown> {
    if (!ship.canSurvey()) {
      return ship.surveyCooldown.cooldown;
    }

    const resp = await this.httpClient.get<SurveyResponse>(`/my/ships/${ship.symbol}/survey`);
    ship.surveyCooldown.setCooldown(resp.cooldown);
    return resp.cooldown;
  }

  public async getSurveys(location: string): Promise<Array<SurveyEntity>> {
    return this.repository.createQueryBuilder("surveys").select()
      .where("surveys.location = :location", {location})
      .getMany();
  }

  public async extract(ship: ShipEntity, survey?: SurveyEntity): Promise<Extraction> {
    const resp = await this.httpClient.post<ExtractResponse>(
      `/my/ships/${ship.symbol}/extract`,
      survey ? {survey: JSON.parse(JSON.stringify(survey))} : {},
    );
    ship.extractCooldown.setCooldown(resp.cooldown);
    return resp.extraction;
  }
  public async extractCooldown(ship: ShipEntity): Promise<Cooldown> {
    const resp = await this.httpClient.get<ExtractResponse>(
      `/my/ships/${ship.symbol}/extract`);
    ship.extractCooldown.setCooldown(resp.cooldown);
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
