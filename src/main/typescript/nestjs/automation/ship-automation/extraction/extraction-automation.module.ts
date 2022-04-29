import { Module } from "@nestjs/common";
import { TradeModule } from "@space-trader-api/trade/trade.module";
import { ExtractionModule } from "@space-trader-api/extraction/extraction.module";
import { SystemModule } from "@space-trader-api/systems/system.module";
import { ShipModule } from "@space-trader-api/ships/ship.module";
import { CooldownModule } from "@space-trader-api/cooldown/cooldown.module";
import {
  ShipAutomationClientModule
} from "@nestjs-server/automation/ship-automation/client/ship-automation-client.module";
import {
  ExtractionAutomationService
} from "@nestjs-server/automation/ship-automation/extraction/extraction-automation.service";
import {
  ExtractionAutomationController
} from "@nestjs-server/automation/ship-automation/extraction/extraction-automation.controller";

@Module({
  imports: [
    TradeModule,
    ExtractionModule,
    SystemModule,
    ShipModule,
    CooldownModule,
    ShipAutomationClientModule,
  ],
  providers: [ExtractionAutomationService],
  controllers: [ExtractionAutomationController],
})
export class ExtractionAutomationModule {}
