import {BaseService} from "../../BaseService";
import { Cargo, ShipEntity } from "./ship.entity";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {Cache} from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class ShipService extends BaseService<ShipEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    @InjectRepository(ShipEntity) repository: Repository<ShipEntity>,
  ) {
    super(httpClient, cacheManager, repository);
  }

  public async get(shipSymbol: string): Promise<ShipEntity> {
    return this.getFromCacheOrFetch(
      shipSymbol,
      () => this.httpClient.get(`/my/ships/${shipSymbol}`),
    );
  }

  public async update(shipSymbol: string): Promise<ShipEntity> {
    return this.updateFromRemote(
      shipSymbol,
      () => this.httpClient.get(`/my/ships/${shipSymbol}`),
    );
  }
  public async updateExisting(ship: ShipEntity): Promise<ShipEntity> {
    const newShip = await this.update(ship.symbol);
    newShip.surveyCooldown = ship.surveyCooldown;
    newShip.extractCooldown = ship.extractCooldown;
    newShip.navigation = ship.navigation;
    return newShip;
  }

  public async getAll(): Promise<Array<ShipEntity>> {
    return this.getAllFromCacheOrFetch(
      "__all__", "symbol",
      () => this.httpClient.get<Array<ShipEntity>>("/my/ships"),
      this.repository.createQueryBuilder().select(),
    );
  }

  public async updateAllShips(): Promise<Array<ShipEntity>> {
    const ships = await this.httpClient.get<Array<ShipEntity>>("/my/ships");
    const shipEntities = new Array<ShipEntity>();
    for (const ship of ships) {
      shipEntities.push(await this.getFromCacheOrFetch(
        ship.symbol, async () => ship));
    }
    return shipEntities;
  }

  public async jettisonCargo(
    shipSymbol: string, cargo: Cargo,
  ): Promise<Cargo> {
    return this.httpClient.post(
      `/my/ships/${shipSymbol}/jettison`,
      {tradeSymbol: cargo.tradeSymbol, units: cargo.units},
    );
  }

  protected async fromJson(json: ShipEntity, ship = new ShipEntity()): Promise<ShipEntity> {
    ship.symbol = json.symbol;
    ship.registration = json.registration;

    ship.frame = json.frame;
    ship.reactor = json.reactor;
    ship.engine = json.engine;
    ship.modules = json.modules;
    ship.mounts = json.mounts;

    ship.integrity = json.integrity;
    ship.stats = json.stats;
    ship.fuel = json.fuel;
    ship.cargo = json.cargo;

    ship.location = json.location ?? "";
    ship.status = json.status;
    return ship;
  }
}
