import { Module } from "@nestjs/common";
import { ShipModule } from "@space-trader-api/ships/ship.module";
import { CooldownModule } from "@space-trader-api/cooldown/cooldown.module";
import {
  ShipAutomationClientModule
} from "@nestjs-server/automation/ship-automation/client/ship-automation-client.module";
import {
  NavigationAutomationService
} from "@nestjs-server/automation/ship-automation/navigation/navigation-automation.service";
import {
  NavigationAutomationController
} from "@nestjs-server/automation/ship-automation/navigation/navigation-automation.controller";

@Module({
  imports: [
    ShipModule,
    CooldownModule,
    ShipAutomationClientModule,
  ],
  providers: [NavigationAutomationService],
  controllers: [NavigationAutomationController],
})
export class NavigationAutomationModule {}
