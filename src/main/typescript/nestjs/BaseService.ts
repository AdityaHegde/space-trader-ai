import {SpaceTraderHttpService} from "@space-trader-api/space-trader-client/space-trader-http.service";
import {Repository, SelectQueryBuilder} from "typeorm";
import { BaseEntity } from "./BaseEntity";

export abstract class BaseService<Entity extends BaseEntity> {
  protected constructor(
    protected readonly httpClient: SpaceTraderHttpService,
    protected readonly repository: Repository<Entity>,
  ) {}

  protected async getFromDBOrFetch(
    primaryKey: string,
    remoteFetcher: () => Promise<Entity>,
    forceLoad = false,
  ): Promise<Entity> {
    const savedEntity = await this.repository.findOne(primaryKey);
    if (!forceLoad && savedEntity) return savedEntity;

    const resp = await remoteFetcher();
    return this.loadEntityFromJson(resp, savedEntity);
  }

  protected async getAllFromDBOrFetch(
    remoteFetcher?: () => Promise<Array<Entity>>,
    repositoryQuery?: SelectQueryBuilder<Entity>,
    forceLoad = false,
  ): Promise<Array<Entity>> {
    if (!forceLoad && repositoryQuery) {
      const savedEntities = await repositoryQuery.getMany();
      if (savedEntities?.length) return savedEntities;
    }

    if (!remoteFetcher) return [];
    const resp = await remoteFetcher();
    return Promise.all(resp.map(async (entityJson) =>
      this.loadEntityFromJson(entityJson)));
  }

  protected async updateFromRemote(
    primaryKey: string, remoteFetcher: () => Promise<Entity>,
  ): Promise<Entity> {
    const entity = await this.repository.findOne(primaryKey);
    const resp = await remoteFetcher();
    return this.loadEntityFromJson(resp, entity);
  }

  protected async loadEntityFromJson(entityJson: Entity, existingEntity?: Entity) {
    const entity = await this.fromJson(entityJson, existingEntity);
    await this.repository.save(entity as any);
    return entity;
  }

  protected abstract fromJson(json: Entity, entity?: Entity): Promise<Entity>;
}
