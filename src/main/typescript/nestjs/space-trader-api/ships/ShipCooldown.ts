import { Cooldown } from "@space-trader-api/types/Cooldown";
import { hasExpired } from "@commons/dateUtils";
import type { CooldownEntity } from "@space-trader-api/cooldown/cooldown.entity";

export class ShipCooldown {
  public cooldown: Cooldown;
  public setCooldown(cooldown: Cooldown) {
    if (hasExpired(cooldown.expiration)) return;
    this.cooldown = cooldown;
  }
  public setCooldownFromEntity(cooldownEntity: CooldownEntity) {
    if (!cooldownEntity || hasExpired(cooldownEntity.finishAt)) {
      this.cooldown = undefined;
      return;
    }
    this.cooldown = {
      expiration: cooldownEntity.finishAt,
      duration: undefined,
    };
  }

  public finishedCooldown(): boolean {
    if (this.cooldown) {
      if (hasExpired(this.cooldown.expiration)) {
        this.cooldown = undefined;
        return true;
      }
      return false;
    }
    return true;
  }
}
