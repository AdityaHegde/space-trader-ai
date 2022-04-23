import {BaseService} from "../../BaseService";
import {TradeEntity} from "./trade.entity";
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {Cache} from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Cargo, ShipEntity } from "@space-trader-api/ships/ship.entity";

export interface ViewMarketResponse {
  exports: Array<TradeEntity>;
  imports: Array<TradeEntity>;
}
export type TradePrices = Record<string, number>;
const TRADE_PRICES_CACHE_TTL = 30 * 60 * 1000;

export interface TradeCargoResponse {
  waypointSymbol: string;
  tradeSymbol: string;
  credits: number;
  units: number;
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

  public async getSystemMarketData(systemSymbol: string, forceLoad = false): Promise<TradeEntity[]> {
    const cachedEntities = await this.cacheManager.get<Array<TradeEntity>>(systemSymbol);
    if (!forceLoad && cachedEntities) return cachedEntities;

    const savedEntities = await this.repository.createQueryBuilder("tradeEntity").select()
      .where("tradeEntity.systemSymbol = :systemSymbol", {systemSymbol}).getMany();
    if (!forceLoad && savedEntities?.length) return savedEntities;

    const markets = await this.httpClient.get<Array<string>>(`/systems/${systemSymbol}/markets`);
    const tradeEntities = new Array<TradeEntity>();

    for (const market of markets) {
      tradeEntities.push(...await this.getWaypointMarketData(systemSymbol, market, forceLoad, false));
    }

    await this.cacheManager.set(
      systemSymbol, tradeEntities,
      {ttl: TRADE_PRICES_CACHE_TTL},
    );

    return tradeEntities;
  }

  public async getWaypointMarketData(
    systemSymbol: string, waypointSymbol: string,
    forceLoad = false, updateSystemCache = true,
  ): Promise<Array<TradeEntity>> {
    const cachedEntities = await this.cacheManager.get<Array<TradeEntity>>(waypointSymbol);
    if (!forceLoad && cachedEntities) return cachedEntities;

    const savedEntities = await this.repository.createQueryBuilder().select()
      .where("waypointSymbol = :waypointSymbol", {waypointSymbol}).getMany();
    if (savedEntities?.length) {
      if (forceLoad) {
        await this.repository.delete({waypointSymbol});
      } else {
        return savedEntities;
      }
    }

    const tradeEntities = new Array<TradeEntity>();
    const getEntity = (entityJson: TradeEntity, isExport: boolean) => {
      return savedEntities.find(entity => {
        return entity.export === isExport && entity.tradeSymbol === entityJson.tradeSymbol;
      });
    };

    const marketDetails = await this.httpClient.get<ViewMarketResponse>(`/systems/${systemSymbol}/markets/${waypointSymbol}`);
    for (const exportJson of marketDetails.exports) {
      const exportEntity = await this.fromJson(exportJson, getEntity(exportJson, true));
      exportEntity.export = true;
      exportEntity.systemSymbol = systemSymbol;
      tradeEntities.push(exportEntity);
    }
    for (const importJson of marketDetails.imports) {
      const importEntity = await this.fromJson(importJson, getEntity(importJson, false));
      importEntity.export = false;
      importEntity.systemSymbol = systemSymbol;
      tradeEntities.push(importEntity);
    }

    await this.repository.save(tradeEntities);
    await this.cacheManager.set(
      waypointSymbol, tradeEntities,
      {ttl: TRADE_PRICES_CACHE_TTL},
    );
    if (updateSystemCache) {
      let systemTradeEntities = await this.cacheManager.get<Array<TradeEntity>>(systemSymbol);
      if (!systemTradeEntities) return;
      systemTradeEntities = systemTradeEntities
        .filter(tradeEntity => tradeEntity.waypointSymbol !== waypointSymbol);
      systemTradeEntities.push(...tradeEntities);
      await this.cacheManager.set(
        systemSymbol, systemTradeEntities,
        {ttl: TRADE_PRICES_CACHE_TTL},
      );
    }

    return tradeEntities;
  }

  public async purchaseCargo(ship: ShipEntity, cargo: Cargo): Promise<Cargo> {
    const resp = await this.httpClient.post<TradeCargoResponse>(
      `/my/ships/${ship.symbol}/purchase`, cargo,
    );
    const purchasedCargo: Cargo = {
      tradeSymbol: resp.tradeSymbol,
      units: resp.units,
    };
    ship.addCargo(purchasedCargo);
    return purchasedCargo;
  }

  public async sellCargo(ship: ShipEntity, cargo: Cargo): Promise<Cargo> {
    const resp = await this.httpClient.post<TradeCargoResponse>(
      `/my/ships/${ship.symbol}/sell`, cargo,
    );
    const soldCargo: Cargo = {
      tradeSymbol: resp.tradeSymbol,
      units: -resp.units,
    };
    ship.removeCargo(soldCargo);
    return soldCargo;
  }

  public async getPricesInSystem(systemSymbol: string, waypointSymbol?: string): Promise<{
    importPrices: TradePrices, exportPrices: TradePrices,
  }> {
    const tradeEntities = waypointSymbol ?
      await this.getWaypointMarketData(systemSymbol, waypointSymbol) :
      await this.getSystemMarketData(systemSymbol);
    const importPrices: TradePrices = {};
    const exportPrices: TradePrices = {};

    tradeEntities.forEach(tradeEntity => {
      if (tradeEntity.export) {
        exportPrices[tradeEntity.tradeSymbol] = tradeEntity.price;
      } else {
        importPrices[tradeEntity.tradeSymbol] = tradeEntity.price;
      }
    });

    return {importPrices, exportPrices};
  }

  public async getTradeEntitiesMap(systemSymbol: string, waypointSymbol?: string): Promise<{
    importEntities: Map<string, TradeEntity>, exportEntities: Map<string, TradeEntity>,
  }> {
    const tradeEntities = waypointSymbol ?
      await this.getWaypointMarketData(systemSymbol, waypointSymbol) :
      await this.getSystemMarketData(systemSymbol);
    const importEntities = new Map<string, TradeEntity>();
    const exportEntities = new Map<string, TradeEntity>();

    tradeEntities.forEach(tradeEntity => {
      if (tradeEntity.export) {
        exportEntities.set(tradeEntity.tradeSymbol, tradeEntity);
      } else {
        importEntities.set(tradeEntity.tradeSymbol, tradeEntity);
      }
    });

    return {importEntities, exportEntities};
  }

  protected async fromJson(json: TradeEntity, trade = new TradeEntity()): Promise<TradeEntity> {
    trade.waypointSymbol = json.waypointSymbol;
    trade.tradeSymbol = json.tradeSymbol;
    trade.price = json.price;
    trade.tariff = json.tariff;
    return trade;
  }
}
