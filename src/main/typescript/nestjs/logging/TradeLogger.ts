import type { Cargo, ShipEntity } from "@space-trader-api/ships/ship.entity";
import type { TradeEntity } from "@space-trader-api/trade/trade.entity";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

export class TradeLogger extends ShipLogger {
  public trade(ship: ShipEntity, cargo: Cargo, tradeEntity: TradeEntity) {
    this.shipLog(ship,
      `${tradeEntity.export ? "Buy" : "Sell"}=${cargo.tradeSymbol} ` +
      `Amount=${cargo.units} Price=${tradeEntity.price}`);
  }
}
