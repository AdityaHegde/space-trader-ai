import { Injectable } from "@nestjs/common";
import { ShipNavigationService } from "@space-trader-api/ships/ship-navigation.service";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { parseLocation } from "@commons/parseLocation";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";
import { ShipStatus } from "@commons/GameConstants";
import { CooldownService } from "@space-trader-api/cooldown/cooldown.service";

export enum FlightPathType {
  Navigate = "Navigate",
  Jump = "Jump",
}
export interface FlightPathEntry {
  location: string;
  type: FlightPathType;
}

@Injectable()
export class NavigationAutomationService {
  private readonly logger = new ShipLogger("Navigation");

  public constructor(
    private readonly shipNavigationService: ShipNavigationService,
    private readonly cooldownService: CooldownService,
  ) {}

  public async plotCourse(ship: ShipEntity, target: string): Promise<Array<FlightPathEntry>> {
    if (ship.location === target) return [];

    const shipLocation = parseLocation(ship.location);
    const targetLocation = parseLocation(target);
    let navigationPath: Array<FlightPathEntry> = [];

    if (shipLocation.system === targetLocation.system) {
      // TODO: make sure the ship has enough fuel
      navigationPath = [{
        location: target,
        type: FlightPathType.Navigate,
      }];
    } else {
      // TODO
      throw new Error(`Unimplemented intra system travel. ` +
        `${ship.location} => ${target}`);
    }

    return navigationPath;
  }

  public async flyTo(ship: ShipEntity, flightPathEntry: FlightPathEntry): Promise<void> {
    switch (flightPathEntry.type) {
      case FlightPathType.Navigate:
        return this.navigateTo(ship, flightPathEntry.location);
      case FlightPathType.Jump:
        return this.jumpTo(ship, flightPathEntry.location);
    }
  }

  /**
   * Navigate the ship at sub light speed
   */
  public async navigateTo(ship: ShipEntity, target: string): Promise<void> {
    if (ship.status !== ShipStatus.ORBIT) {
      await this.shipNavigationService.orbitShip(ship.symbol);
    }
    const navigationResp = await this.shipNavigationService.navigate(ship.symbol, target);
    this.logger.shipLog(ship, `Flying to Target=${target} ` +
      `FuelCost=${navigationResp.fuelCost}`);
    ship.navigation = navigationResp.navigation;
  }

  /**
   * Jump the ship at faster than light speed
   */
  public async jumpTo(ship: ShipEntity, target: string): Promise<void> {
    if (ship.status !== ShipStatus.ORBIT) {
      await this.shipNavigationService.orbitShip(ship.symbol);
    }
    const jumpResp = await this.shipNavigationService.jump(ship.symbol, target);
    this.logger.shipLog(ship, `Jumped to Target=${target}`);
    ship.jumpCooldown.setCooldown(jumpResp.cooldown);
    await this.cooldownService.upsertJumpCooldown(ship);
  }
}
