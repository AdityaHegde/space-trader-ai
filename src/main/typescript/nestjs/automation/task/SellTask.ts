import { Task } from "@nestjs-server/automation/task/Task";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { AutomationEntity } from "@nestjs-server/automation/automation.entity";
import { TradeService } from "@space-trader-api/trade/trade.service";
import { parseLocation } from "@commons/parseLocation";
import { WaypointService } from "@space-trader-api/systems/waypoint.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SellTask extends Task {
  public constructor(
    private readonly tradeService: TradeService,
    private readonly waypointService: WaypointService,
  ) {
    super();
  }

  public isDone(ship: ShipEntity): boolean {
    return ship.isEmpty();
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
  }

  public async doTask(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    const {system} = parseLocation(ship.location);
    const {importEntities} = await this.tradeService.getTradeEntitiesMap(system, automation.target);

    const cargoToBeSold = ship.cargo
      .filter(cargo => importEntities.has(cargo.tradeSymbol));

    while (cargoToBeSold.length > 0) {
      await this.tradeService.sellCargo(ship, cargoToBeSold.pop());
    }

    automation.target = undefined;
  }
}
