import { ShipAutomationService } from "@nestjs-server/automation/ship-automation.service";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { asyncWait } from "@commons/asyncWait";
import { AUTOMATION_INTERVAL } from "@commons/constants";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AutomationService {
  private continueAutomation: boolean;

  public constructor(
    private readonly shipAutomationService: ShipAutomationService,
    private readonly shipService: ShipService,
  ) {}

  public async runAutomation(): Promise<void> {
    this.continueAutomation = true;

    const ships = await this.shipService.updateAllShips();

    while (this.continueAutomation) {
      await this.shipAutomationService.automateShips(ships);

      await asyncWait(AUTOMATION_INTERVAL);
    }
  }

  public stopAutomation() {
    this.continueAutomation = false;
  }
}
