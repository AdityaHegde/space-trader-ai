import {BaseService} from "../../BaseService";
import {TradeEntity} from "./trade.entity";
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {Cache} from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

export interface ViewMarketResponse {
  exports: Array<TradeEntity>;
  imports: Array<TradeEntity>;
}

@Injectable()
export class TradeService extends BaseService<TradeEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    @InjectRepository(TradeEntity) repository: Repository<TradeEntity>,
  ) {
    super(httpClient, cacheManager, repository);
  }

  public async loadMarketData(systemSymbol: string): Promise<TradeEntity[]> {
    const cachedEntities = await this.cacheManager.get<Array<TradeEntity>>(systemSymbol);
    if (cachedEntities) return cachedEntities;

    const savedEntities = await this.repository.createQueryBuilder().select()
      .where("system = :system", {system: systemSymbol}).getMany();
    if (savedEntities?.length) return savedEntities;

    const markets = await this.httpClient.get<Array<string>>(`/systems/${systemSymbol}/markets`);
    const tradeEntities = new Array<TradeEntity>();

    for (const market of markets) {
      const marketDetails = await this.httpClient.get<ViewMarketResponse>(`/systems/${systemSymbol}/markets/${market}`);
      for (const exportJson of marketDetails.exports) {
        const exportEntity = await this.fromJson(exportJson);
        exportEntity.export = true;
        exportEntity.system = systemSymbol;
        tradeEntities.push(exportEntity);
      }
      for (const importJson of marketDetails.imports) {
        const importEntity = await this.fromJson(importJson);
        importEntity.export = false;
        importEntity.system = systemSymbol;
        tradeEntities.push(importEntity);
      }
    }

    await this.repository.save(tradeEntities);

    return tradeEntities;
  }

  protected async fromJson(json: TradeEntity, trade = new TradeEntity()): Promise<TradeEntity> {
    trade.waypointSymbol = json.waypointSymbol;
    trade.tradeSymbol = json.tradeSymbol;
    trade.price = json.price;
    trade.tariff = json.tariff;
    return trade;
  }
}
