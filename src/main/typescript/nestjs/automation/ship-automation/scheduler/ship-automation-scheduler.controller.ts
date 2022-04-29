import { Controller } from "@nestjs/common";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipAutomationClient } from "@nestjs-server/automation/ship-automation/client/ShipAutomationClient";
import { EventPattern } from "@nestjs/microservices";
import { AutomationEntity, AutomationTask } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { ShipType } from "@commons/GameConstants";
import { Cron } from "@nestjs/schedule";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

@Controller()
export class ShipAutomationSchedulerController {
  private readonly logger = new ShipLogger("Scheduler")

  public constructor(
    private readonly shipService: ShipService,
    private readonly shipAutomationClient: ShipAutomationClient,
  ) {}

  @EventPattern(AutomationTask.Schedule)
  public async schedule(shipAutomation: AutomationEntity) {
    const ship = await this.shipService.get(shipAutomation.shipSymbol);
    this.logger.shipLog(ship, "Begin");

    switch (ship.registration.role) {
      case ShipType.COMMAND:
      case ShipType.EXCAVATOR:
        await this.scheduleExtractor(ship, shipAutomation);
        break;
      default: break;
    }

    this.logger.shipLog(ship, JSON.stringify(shipAutomation));

    await this.shipAutomationClient.schedule(shipAutomation);
  }

  @Cron("* * * * * *")
  public async enqueue(): Promise<void> {
    const automationEntities = await this.shipAutomationClient.getAll();
    this.logger.debug(`Have ${automationEntities.length} entities. Pushing to queue.`);
    automationEntities.forEach(automationEntity =>
      this.shipAutomationClient.enqueue(automationEntity));
  }

  private async scheduleExtractor(ship: ShipEntity, shipAutomation: AutomationEntity) {
    if (ship.isCargoFull()) {
      shipAutomation.target = undefined;
      shipAutomation.task = AutomationTask.Sell;
    } else {
      shipAutomation.target = undefined;
      shipAutomation.task = AutomationTask.Extract;
    }
  }
}
