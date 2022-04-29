import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { AutomationEntity, AutomationTask } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import {
  FlightPathType,
  NavigationAutomationService
} from "@nestjs-server/automation/ship-automation/navigation/navigation-automation.service";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { ShipAutomationClient } from "@nestjs-server/automation/ship-automation/client/ShipAutomationClient";
import { CooldownService } from "@space-trader-api/cooldown/cooldown.service";
import { getCurrentTime } from "@commons/dateUtils";

@Controller()
export class NavigationAutomationController {
  private readonly logger = new ShipLogger("Navigation");

  public constructor(
    private readonly navigationAutomationService: NavigationAutomationService,
    private readonly shipService: ShipService,
    private readonly shipAutomationClient: ShipAutomationClient,
    private readonly cooldownService: CooldownService,
  ) {}

  @EventPattern(AutomationTask.Navigate)
  public async navigateShip(shipAutomation: AutomationEntity) {
    const ship = await this.shipService.forceGet(shipAutomation.shipSymbol);
    this.logger.shipLog(ship, "Begin");

    if (!await this.checkNavigationPath(ship, shipAutomation)) {
      return this.enqueueNext(ship, shipAutomation);
    }

    this.logger.shipLog(ship,
      `Target=${shipAutomation.target} `+
      `Path=${JSON.stringify(shipAutomation.flightPath)}`);
    try {
      await this.navigationAutomationService.flyTo(ship, shipAutomation.flightPath[0]);
    }  catch (err) {
      return this.shipAutomationClient.reschedule(shipAutomation);
    }
    shipAutomation.flightPath.shift();
    return this.enqueueNext(ship, shipAutomation);
  }

  private async checkNavigationPath(ship: ShipEntity, shipAutomation: AutomationEntity): Promise<boolean> {
    if (!shipAutomation.flightPath?.length) {
      shipAutomation.flightPath = await this.navigationAutomationService
        .plotCourse(ship, shipAutomation.target);
    }
    return !!shipAutomation.flightPath?.length;
  }

  private async enqueueNext(ship: ShipEntity, shipAutomation: AutomationEntity): Promise<void> {
    if (shipAutomation.flightPath.length > 1 &&
      shipAutomation.flightPath[1].type === FlightPathType.Jump) {
      await this.cooldownService.getJumpCooldown(ship);
      shipAutomation.runAfter = ship.jumpCooldown.cooldown?.expiration ?? getCurrentTime();
    } else {
      shipAutomation.runAfter = NavigationAutomationController.getRunAfter(ship);
    }

    if (!shipAutomation.flightPath.length) {
      shipAutomation.task = shipAutomation.nextTask;
      shipAutomation.nextTask = undefined;
    }

    return this.shipAutomationClient.schedule(shipAutomation);
  }

  private static getRunAfter(ship: ShipEntity): string {
    if (ship.navigation) {
      return new Date(Date.now() +
        ship.navigation.durationRemaining * 1000).toISOString();
    }
    return getCurrentTime();
  }
}
