import { Controller } from "@nestjs/common";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";
import {
  ExtractionAutomationService
} from "@nestjs-server/automation/ship-automation/extraction/extraction-automation.service";
import { AutomationEntity, AutomationTask } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { EventPattern } from "@nestjs/microservices";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipAutomationClient } from "@nestjs-server/automation/ship-automation/client/ShipAutomationClient";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { getCurrentTime } from "@commons/dateUtils";

@Controller()
export class ExtractionAutomationController {
  private readonly logger = new ShipLogger("Extraction");

  public constructor(
    private readonly extractionAutomationService: ExtractionAutomationService,
    private readonly shipService: ShipService,
    private readonly shipAutomationClient: ShipAutomationClient,
  ) {}

  @EventPattern(AutomationTask.Extract)
  public async extract(shipAutomation: AutomationEntity) {
    const ship = await this.shipService.forceGet(shipAutomation.shipSymbol);
    this.logger.shipLog(ship, "Begin");

    if (!await this.acquireTarget(ship, shipAutomation)) return;
    if (ship.isCargoFull()) return this.enqueueNext(ship, shipAutomation);

    try {
      await this.extractionAutomationService.extract(ship);
    } catch (err) {
      return this.shipAutomationClient.reschedule(shipAutomation);
    }
    return this.enqueueNext(ship, shipAutomation);
  }

  private async acquireTarget(ship: ShipEntity, shipAutomation: AutomationEntity): Promise<boolean> {
    if (!shipAutomation.target) {
      shipAutomation.target = await this.extractionAutomationService.getTarget(ship);
      if (!shipAutomation.target) {
        await this.shipAutomationClient.reschedule(shipAutomation);
        return false;
      }
    }
    if (ship.location !== shipAutomation.target) {
      await this.shipAutomationClient.scheduleNavigation(
        shipAutomation, AutomationTask.Extract);
      return false;
    }
    return true;
  }

  private async enqueueNext(ship: ShipEntity, shipAutomation: AutomationEntity): Promise<void> {
    if (ship.isCargoFull()) {
      shipAutomation.task = AutomationTask.Schedule;
      shipAutomation.runAfter = getCurrentTime();
    } else {
      shipAutomation.runAfter = new Date(ship.extractCooldown.cooldown.expiration).toISOString();
    }
    return this.shipAutomationClient.schedule(shipAutomation);
  }
}
