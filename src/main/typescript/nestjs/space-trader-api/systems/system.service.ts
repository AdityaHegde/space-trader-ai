import {BaseService} from "../../BaseService";
import {CACHE_MANAGER, Inject, Injectable} from "@nestjs/common";
import {SpaceTraderHttpService} from "../space-trader-client/space-trader-http.service";
import {Cache} from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {SystemEntity} from "./system.entity";

@Injectable()
export class SystemService extends BaseService<SystemEntity> {
  public constructor(
    httpClient: SpaceTraderHttpService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    @InjectRepository(SystemEntity) repository: Repository<SystemEntity>
  ) {
    super(httpClient, cacheManager, repository);
  }

  public async get(systemSymbol: string): Promise<SystemEntity> {
    return this.getFromCacheOrFetch(
      systemSymbol,
      () => this.httpClient.get<SystemEntity>(`/systems/${systemSymbol}`),
    );
  }

  public async update(systemSymbol: string): Promise<SystemEntity> {
    return this.updateFromRemote(
      systemSymbol,
      () => this.httpClient.get<SystemEntity>(`/systems/${systemSymbol}`),
    );
  }

  public async getAll(): Promise<Array<SystemEntity>> {
    return this.getAllFromCacheOrFetch(
      "__all__", "symbol",
      () => this.httpClient.get<Array<SystemEntity>>("/systems"),
      this.repository.createQueryBuilder().select(),
    );
  }

  public async updateAllSystems(): Promise<Array<SystemEntity>> {
    const systems = await this.getAll();
    for (const system of systems) {
      if (!system.charted) {
        await this.update(system.symbol);
      }
    }

    return systems;
  }

  protected async fromJson(json: SystemEntity, system = new SystemEntity()): Promise<SystemEntity> {
    system.symbol = json.symbol;
    system.sector = json.sector;
    system.type = json.type;
    system.x = json.x;
    system.y = json.y;
    system.factions = json.factions;
    system.charted = json.charted;
    system.chartedBy = json.chartedBy;
    return system;
  }
}
