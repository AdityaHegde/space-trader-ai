import { Task } from "@nestjs-server/automation/task/Task";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { AutomationEntity } from "@nestjs-server/automation/automation.entity";
import { TradeService } from "@space-trader-api/trade/trade.service";
import { parseLocation } from "@commons/parseLocation";
import { Injectable } from "@nestjs/common";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { TradeLogger } from "@nestjs-server/logging/TradeLogger";
import { ShipStatus } from "@commons/GameConstants";
import { ShipNavigationService } from "@space-trader-api/ships/ship-navigation.service";

@Injectable()
export class SellTask extends Task {
  private readonly logger = new TradeLogger("SellTask");

  public constructor(
    private readonly tradeService: TradeService,
    private readonly shipService: ShipService,
    private readonly shipNavigationService: ShipNavigationService,
  ) {
    super();
  }

  public isDone(ship: ShipEntity): boolean {
    return ship.isCargoEmpty();
  }

  public async acquireTarget(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    const {system} = parseLocation(ship.location);
    const {importEntities} = await this.tradeService.getTradeEntitiesMap(system);

    for (const cargo of ship.cargo) {
      if (importEntities.has(cargo.tradeSymbol)) {
        automation.target = importEntities.get(cargo.tradeSymbol).waypointSymbol;
        return;
      }
    }

    for (const cargo of ship.cargo) {
      await this.shipService.jettisonCargo(ship, cargo);
    }
  }

  public async doTask(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    if (ship.status !== ShipStatus.DOCKED) {
      await this.shipNavigationService.dockShip(ship.symbol);
    }

    const {system} = parseLocation(ship.location);
    const {importEntities} = await this.tradeService.getTradeEntitiesMap(system, automation.target);

    const cargoToBeSold = ship.cargo
      .filter(cargo => importEntities.has(cargo.tradeSymbol));

    this.logger.shipCargoLog(ship, `Selling ${cargoToBeSold.map(cargo => cargo.tradeSymbol).join(",")}`);

    while (cargoToBeSold.length > 0) {
      const soldCargo = cargoToBeSold.pop();
      this.logger.trade(ship, soldCargo, importEntities.get(soldCargo.tradeSymbol));
      await this.tradeService.sellCargo(ship, soldCargo);
    }

    automation.target = "";
  }
}
