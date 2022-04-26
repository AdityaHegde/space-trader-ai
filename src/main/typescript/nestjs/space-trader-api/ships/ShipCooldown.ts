import { Cooldown } from "@space-trader-api/types/Cooldown";
import { hasExpired } from "@commons/dateUtils";

export class ShipCooldown {
  public cooldown: Cooldown;
  public setCooldown(cooldown: Cooldown) {
    if (hasExpired(cooldown.expiration)) return;
    this.cooldown = cooldown;
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
