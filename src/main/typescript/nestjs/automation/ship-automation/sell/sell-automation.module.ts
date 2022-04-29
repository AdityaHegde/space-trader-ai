import { Module } from "@nestjs/common";
import { ShipModule } from "@space-trader-api/ships/ship.module";
import { TradeModule } from "@space-trader-api/trade/trade.module";
import {
  ShipAutomationClientModule
} from "@nestjs-server/automation/ship-automation/client/ship-automation-client.module";
import { SellAutomationService } from "@nestjs-server/automation/ship-automation/sell/sell-automation.service";
import { SellAutomationController } from "@nestjs-server/automation/ship-automation/sell/sell-automation.controller";

@Module({
  imports: [
    ShipModule,
    TradeModule,
    ShipAutomationClientModule,
  ],
  providers: [SellAutomationService],
  controllers: [SellAutomationController],
})
export class SellAutomationModule {}
