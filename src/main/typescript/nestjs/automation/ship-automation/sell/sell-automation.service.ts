import { Injectable } from "@nestjs/common";
import { TradeService } from "@space-trader-api/trade/trade.service";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipNavigationService } from "@space-trader-api/ships/ship-navigation.service";
import { parseLocation } from "@commons/parseLocation";
import type { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { ShipStatus } from "@commons/GameConstants";
import { TradeLogger } from "@nestjs-server/logging/TradeLogger";

@Injectable()
export class SellAutomationService {
  private readonly logger = new TradeLogger("Sell");

  public constructor(
    private readonly tradeService: TradeService,
    private readonly shipService: ShipService,
    private readonly shipNavigationService: ShipNavigationService,
  ) {}

  public async getTarget(ship: ShipEntity): Promise<string> {
    const {system} = parseLocation(ship.location);
    const {importEntities} = await this.tradeService.getTradeEntitiesMap(system);

    for (const cargo of ship.cargo) {
      if (importEntities.has(cargo.tradeSymbol)) {
        return importEntities.get(cargo.tradeSymbol).waypointSymbol;
      }
    }

    for (const cargo of ship.cargo) {
      await this.shipService.jettisonCargo(ship, cargo);
    }
    return undefined;
  }

  public async sell(ship: ShipEntity): Promise<void> {
    if (ship.status !== ShipStatus.DOCKED) {
      await this.shipNavigationService.dockShip(ship.symbol);
    }

    const {system} = parseLocation(ship.location);
    const {importEntities} = await this.tradeService.getTradeEntitiesMap(system, ship.location);

    const cargoToBeSold = ship.cargo
      .filter(cargo => importEntities.has(cargo.tradeSymbol));

    this.logger.shipCargoLog(ship, `Selling ${cargoToBeSold.map(cargo => cargo.tradeSymbol).join(",")}`);

    while (cargoToBeSold.length > 0) {
      const soldCargo = cargoToBeSold.pop();
      this.logger.trade(ship, soldCargo, importEntities.get(soldCargo.tradeSymbol));
      await this.tradeService.sellCargo(ship, soldCargo);
    }
  }
}
