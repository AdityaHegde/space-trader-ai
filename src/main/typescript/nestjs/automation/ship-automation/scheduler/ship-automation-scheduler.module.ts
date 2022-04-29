import { Module } from "@nestjs/common";
import { ShipModule } from "@space-trader-api/ships/ship.module";
import {
  ShipAutomationSchedulerController
} from "@nestjs-server/automation/ship-automation/scheduler/ship-automation-scheduler.controller";
import {
  ShipAutomationClientModule
} from "@nestjs-server/automation/ship-automation/client/ship-automation-client.module";

@Module({
  imports: [
    ShipModule,
    ShipAutomationClientModule,
  ],
  controllers: [ShipAutomationSchedulerController]
})
export class ShipAutomationSchedulerModule {}
