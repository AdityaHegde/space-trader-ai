import { Injectable } from "@nestjs/common";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipAutomationClient } from "@nestjs-server/automation/ship-automation/client/ShipAutomationClient";
import { AutomationTask } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { getCurrentTime } from "@commons/dateUtils";

@Injectable()
export class AutomationService {
  public constructor(
    private readonly shipService: ShipService,
    private readonly shipAutomationClient: ShipAutomationClient,
  ) {}

  public async initShips(): Promise<void> {
    const ships = await this.shipService.updateAllShips();
    for (const ship of ships) {
      if (ship.symbol === "ADITYA-2") continue;
      const automationEntity = await this.shipAutomationClient.getOrCreate(ship.symbol);
      if (!automationEntity.task) {
        automationEntity.task = AutomationTask.Schedule;
        automationEntity.runAfter = getCurrentTime();
      }
      await this.shipAutomationClient.schedule(automationEntity);
    }
  }
}
