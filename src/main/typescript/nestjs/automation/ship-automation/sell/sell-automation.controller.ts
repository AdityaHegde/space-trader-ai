import { Controller } from "@nestjs/common";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipAutomationClient } from "@nestjs-server/automation/ship-automation/client/ShipAutomationClient";
import { SellAutomationService } from "@nestjs-server/automation/ship-automation/sell/sell-automation.service";
import { EventPattern } from "@nestjs/microservices";
import { AutomationEntity, AutomationTask } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { getCurrentTime } from "@commons/dateUtils";
import { ShipNavigationService } from "@space-trader-api/ships/ship-navigation.service";

@Controller()
export class SellAutomationController {
  private readonly logger = new ShipLogger("Sell");

  public constructor(
    private readonly sellAutomationService: SellAutomationService,
    private readonly shipService: ShipService,
    private readonly shipAutomationClient: ShipAutomationClient,
    private readonly shipNavigationService: ShipNavigationService,
  ) {}

  @EventPattern(AutomationTask.Sell)
  public async navigateShip(shipAutomation: AutomationEntity) {
    const ship = await this.shipService.forceGet(shipAutomation.shipSymbol);
    this.logger.shipLog(ship, "Begin");

    if (!await this.acquireTarget(ship, shipAutomation)) return;

    try {
      await this.sellAutomationService.sell(ship);
    } catch (err) {
      return this.shipAutomationClient.reschedule(shipAutomation);
    }
    if (ship.fuel < ship.stats.fuelTank) {
      await this.shipNavigationService.refuelShip(ship.symbol);
    }
    return this.enqueueNext(ship, shipAutomation);
  }

  private async acquireTarget(ship: ShipEntity, shipAutomation: AutomationEntity): Promise<boolean> {
    if (!shipAutomation.target) {
      shipAutomation.target = await this.sellAutomationService.getTarget(ship);
      if (!shipAutomation.target) return false;
    }
    if (ship.location !== shipAutomation.target) {
      await this.shipAutomationClient.scheduleNavigation(
        shipAutomation, AutomationTask.Sell);
      return false;
    }
    return true;
  }

  private async enqueueNext(ship: ShipEntity, shipAutomation: AutomationEntity): Promise<void> {
    if (ship.isCargoEmpty()) {
      shipAutomation.task = AutomationTask.Schedule;
      shipAutomation.runAfter = getCurrentTime();
    }
    shipAutomation.target = undefined;
    return this.shipAutomationClient.schedule(shipAutomation);
  }
}
