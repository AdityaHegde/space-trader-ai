import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CooldownEntity, CooldownType } from "@space-trader-api/cooldown/cooldown.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";

@Injectable()
export class CooldownService {
  public constructor(
    @InjectRepository(CooldownEntity)
    private readonly repository: Repository<CooldownEntity>
  ) {}

  public get(symbol: string, type: CooldownType) {
    return this.repository.findOne({ where: {symbol, type} });
  }
  public async getJumpCooldown(ship: ShipEntity) {
    ship.jumpCooldown.setCooldownFromEntity(
      await this.get(ship.symbol, CooldownType.Jump));
  }
  public async getExtractCooldown(ship: ShipEntity) {
    ship.extractCooldown.setCooldownFromEntity(
      await this.get(ship.symbol, CooldownType.Extract));
  }
  public async getSurveyCooldown(ship: ShipEntity) {
    ship.surveyCooldown.setCooldownFromEntity(
      await this.get(ship.symbol, CooldownType.Survey));
  }

  public async upsert(symbol: string, type: CooldownType, finishAt: string) {
    if (!finishAt) return;
    let cooldownEntity = await this.get(symbol, type);
    if (!cooldownEntity) {
      cooldownEntity = new CooldownEntity();
      cooldownEntity.symbol = symbol;
      cooldownEntity.type = type;
    }
    cooldownEntity.finishAt = finishAt;
    return this.repository.save(cooldownEntity);
  }
  public upsertJumpCooldown(ship: ShipEntity) {
    return this.upsert(ship.symbol, CooldownType.Jump,
      ship.jumpCooldown.cooldown?.expiration);
  }
  public upsertExtractCooldown(ship: ShipEntity) {
    return this.upsert(ship.symbol, CooldownType.Extract,
      ship.extractCooldown.cooldown?.expiration);
  }
  public upsertSurveyCooldown(ship: ShipEntity) {
    return this.upsert(ship.symbol, CooldownType.Survey,
      ship.surveyCooldown.cooldown?.expiration);
  }
}
