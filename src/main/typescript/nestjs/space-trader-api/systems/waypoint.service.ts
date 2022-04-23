import {BaseService} from "../../BaseService";
import {WaypointEntity} from "./waypoint.entity";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {Cache} from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SystemService} from "./system.service";
import { WaypointType } from "@commons/GameConstants";

@Injectable()
export class WaypointService extends BaseService<WaypointEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    @InjectRepository(WaypointEntity) repository: Repository<WaypointEntity>,
    private readonly systemService: SystemService,
  ) {
    super(httpClient, cacheManager, repository);
  }

  public async get(systemSymbol: string, waypointSymbol: string): Promise<WaypointEntity> {
    return this.getFromCacheOrFetch(
      waypointSymbol,
      () => this.httpClient.get<WaypointEntity>(
        `/systems/${systemSymbol}/waypoints/${waypointSymbol}`),
    );
  }

  public async update(systemSymbol: string, waypointSymbol: string): Promise<WaypointEntity> {
    return this.updateFromRemote(
      waypointSymbol,
      () => this.httpClient.get<WaypointEntity>(
        `/systems/${systemSymbol}/waypoints/${waypointSymbol}`),
    );
  }

  public async getAll(systemSymbol: string): Promise<WaypointEntity[]> {
    return this.getAllFromCacheOrFetch(
      systemSymbol,
      "symbol",
      () => this.httpClient.get<Array<WaypointEntity>>(
        `/systems/${systemSymbol}/waypoints`),
      this.repository.createQueryBuilder("waypoints")
        .select()
        .where("waypoints.system = :system", { system: systemSymbol })
    );
  }

  public async updateAllWaypoints(systemSymbol: string): Promise<WaypointEntity[]> {
    const waypoints = await this.getAll(systemSymbol);
    for (const waypoint of waypoints) {
      if (!waypoint.charted) {
        await this.update(systemSymbol, waypoint.symbol);
      }
    }
    return waypoints;
  }

  public async findAsteroidInSystem(systemSymbol: string): Promise<WaypointEntity> {
    return this.repository.findOne(
      {where: {system: systemSymbol, type: WaypointType.ASTEROID_FIELD}},
    );
  }

  protected async fromJson(json: WaypointEntity, waypoint = new WaypointEntity()): Promise<WaypointEntity> {
    waypoint.symbol = json.symbol;
    waypoint.type = json.type;
    waypoint.system = await this.systemService.get((json.system as any));
    waypoint.x = json.x;
    waypoint.y = json.y;
    waypoint.orbitals = json.orbitals;
    waypoint.faction = json.faction;
    waypoint.features = json.features;
    waypoint.traits = json.traits;
    waypoint.charted = json.charted;
    waypoint.chartedBy = json.chartedBy;
    return waypoint;
  }
}
