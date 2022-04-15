import {BaseService} from "../BaseService";
import {ShipEntity} from "./ship.entity";
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

  public async getAll(): Promise<Array<ShipEntity>> {
    return this.getAllFromCacheOrFetch(
      "__all__", "symbol",
      () => this.httpClient.get<Array<ShipEntity>>("/my/ships"),
      this.repository.createQueryBuilder().select(),
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

    ship.location = json.location;
    ship.status = json.status;
    return ship;
  }
}
