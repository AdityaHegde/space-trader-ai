import { Module } from "@nestjs/common";
import {
  ShipAutomationSchedulerModule
} from "@nestjs-server/automation/ship-automation/scheduler/ship-automation-scheduler.module";
import {
  ExtractionAutomationModule
} from "@nestjs-server/automation/ship-automation/extraction/extraction-automation.module";
import {
  NavigationAutomationModule
} from "@nestjs-server/automation/ship-automation/navigation/navigation-automation.module";
import { SellAutomationModule } from "@nestjs-server/automation/ship-automation/sell/sell-automation.module";
import { AutomationService } from "@nestjs-server/automation/automation.service";
import { ShipModule } from "@space-trader-api/ships/ship.module";
import {
  ShipAutomationClientModule
} from "@nestjs-server/automation/ship-automation/client/ship-automation-client.module";

@Module({
  imports: [
    ShipAutomationSchedulerModule,
    ExtractionAutomationModule,
    NavigationAutomationModule,
    SellAutomationModule,
    ShipModule,
    ShipAutomationClientModule,
  ],
  providers: [AutomationService],
  exports: [AutomationService],
})
export class AutomationModule {}
