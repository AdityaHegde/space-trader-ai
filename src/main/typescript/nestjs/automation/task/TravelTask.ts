import { Task } from "./Task";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { AutomationEntity } from "../automation.entity";
import { ShipNavigationService } from "@space-trader-api/ships/ship-navigation.service";
import { ShipStatus } from "@commons/GameConstants";
import { parseLocation } from "@commons/parseLocation";
import { Injectable } from "@nestjs/common";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

@Injectable()
export class TravelTask extends Task {
  private readonly logger = new ShipLogger("TravelTask");

  constructor(
    private readonly shipNavigationService: ShipNavigationService,
  ) {
    super();
  }

  public skip(ship: ShipEntity): boolean {
    return !ship.hasNavigated();
  }

  public isDone(ship: ShipEntity, automation: AutomationEntity): boolean {
    if (ship.location === automation.travelPath[0]) {
      this.logger.shipLog(ship, `Navigated to Destination=${automation.travelPath[0]}`);
      automation.travelPath.shift();
    }
    return automation.travelPath.length === 0;
  }

  public start(ship: ShipEntity): Promise<void> {
    if (ship.status !== ShipStatus.ORBIT) {
      return this.shipNavigationService.orbitShip(ship.symbol);
    }
  }

  public hasTarget(ship: ShipEntity, automation: AutomationEntity): boolean {
    return !!automation.travelPath;
  }

  public async acquireTarget(
    ship: ShipEntity, automation: AutomationEntity,
  ): Promise<void> {
    const shipLocation = parseLocation(ship.location);
    const targetLocation = parseLocation(automation.target);
    if (shipLocation.system === targetLocation.system) {
      // TODO: make sure the ship has enough fuel
      automation.travelPath = [automation.target];
    } else {
      // TODO
      throw new Error(`Unimplemented intra system travel. ` +
        `${ship.location} => ${automation.target}`);
    }
  }

  public async doTask(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    this.logger.shipLog(ship, `Navigating to Destination=${automation.travelPath[0]}`);
    ship.navigation = (await this.shipNavigationService
      .navigate(ship.symbol, automation.travelPath[0])).navigation;
    ship.navigation.departedAt = new Date().toString();
  }
}
