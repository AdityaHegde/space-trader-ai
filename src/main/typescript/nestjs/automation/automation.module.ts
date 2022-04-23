import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AutomationEntity } from "@nestjs-server/automation/automation.entity";
import { TravelTask } from "@nestjs-server/automation/task/TravelTask";
import { ExtractTask } from "@nestjs-server/automation/task/ExtractTask";
import { SellTask } from "@nestjs-server/automation/task/SellTask";
import { AutomationService } from "@nestjs-server/automation/automation.service";
import { ShipModule } from "@space-trader-api/ships/ship.module";
import { ExtractionModule } from "@space-trader-api/extraction/extraction.module";
import { TradeModule } from "@space-trader-api/trade/trade.module";
import { SystemModule } from "@space-trader-api/systems/system.module";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([AutomationEntity]),
    ShipModule,
    ExtractionModule,
    TradeModule,
    SystemModule,
  ],
  providers: [
    TravelTask, ExtractTask, SellTask,
    AutomationService,
  ],
  exports: [
    TypeOrmModule,
    AutomationService,
  ],
})
export class AutomationModule {}