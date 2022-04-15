import {SpaceTraderHttpService} from "./space-trader-client/space-trader-http.service";
import {Cache} from "cache-manager";
import {Repository, SelectQueryBuilder} from "typeorm";
import { BaseEntity } from "./BaseEntity";

export abstract class BaseService<Entity extends BaseEntity> {
  protected constructor(
    protected readonly httpClient: SpaceTraderHttpService,
    protected readonly cacheManager: Cache,
    protected readonly repository: Repository<Entity>,
  ) {}

  protected async getFromCacheOrFetch(
    primaryKey: string, remoteFetcher: () => Promise<Entity>
  ): Promise<Entity> {
    const cachedEntity = await this.cacheManager.get<Entity>(primaryKey);
    if (cachedEntity) return cachedEntity;

    const savedEntity = await this.repository.findOne(primaryKey);
    if (savedEntity) return savedEntity;

    const resp = await remoteFetcher();
    return this.newEntityFromJson(resp, primaryKey);
  }

  protected async getAllFromCacheOrFetch(
    cacheKey: string, primaryKeyField: string,
    remoteFetcher?: () => Promise<Array<Entity>>,
    repositoryQuery?: SelectQueryBuilder<Entity>,
  ): Promise<Array<Entity>> {
    const cachedEntities = await this.cacheManager.get<Array<Entity>>(cacheKey);
    if (cachedEntities) return cachedEntities;

    if (repositoryQuery) {
      const savedEntities = await repositoryQuery.getMany();
      if (savedEntities?.length) return savedEntities;
    }

    if (!remoteFetcher) return [];
    const resp = await remoteFetcher();
    const entities = await Promise.all(resp.map(async (entityJson) => {
      return this.newEntityFromJson(entityJson, entityJson[primaryKeyField]);
    }));
    return this.cacheManager.set<Array<Entity>>(cacheKey, entities);
  }

  protected async updateFromRemote(
    primaryKey: string, remoteFetcher: () => Promise<Entity>
  ): Promise<Entity> {
    const entity = await this.repository.findOne(primaryKey);
    const resp = await remoteFetcher();
    await this.fromJson(resp, entity);
    await this.repository.save(entity as any);
    return entity;
  }

  protected async newEntityFromJson(entityJson: Entity, primaryKey: string) {
    const entity = await this.fromJson(entityJson);
    await this.repository.save(entity as any);
    return this.cacheManager.set<Entity>(primaryKey, entity);
  }

  protected abstract fromJson(json: Entity, entity?: Entity): Promise<Entity>;
}
