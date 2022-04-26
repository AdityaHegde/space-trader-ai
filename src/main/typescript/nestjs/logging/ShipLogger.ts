import { AppLogger } from "@nestjs-server/logging/AppLogger";
import type { ShipEntity } from "@space-trader-api/ships/ship.entity";

export class ShipLogger extends AppLogger {
  public shipLog(ship: ShipEntity, message: string) {
    this.logger.info(`Ship=${ship.symbol} Location=${ship.location} ${message}`);
  }

  public shipCargoLog(ship: ShipEntity, message: string) {
    this.logger.info(`Ship=${ship.symbol} ` +
      `ShipCargo=${ship.cargo.map(cargo => `${cargo.tradeSymbol}:${cargo.units}`).join(" ")} ` +
      `${message}`);
  }
}
