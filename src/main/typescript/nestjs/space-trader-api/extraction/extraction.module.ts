import {Module} from "@nestjs/common";
import {ExtractionService} from "./extraction.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SurveyEntity} from "./survey.entity";
import {SpaceTraderClientModule} from "../space-trader-client/space-trader-client.module";
import { CooldownModule } from "@space-trader-api/cooldown/cooldown.module";
import { TradeModule } from "@space-trader-api/trade/trade.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyEntity]),
    SpaceTraderClientModule,
    CooldownModule,
    TradeModule,
  ],
  providers: [
    ExtractionService,
  ],
  exports: [
    TypeOrmModule,
    ExtractionService,
  ],
})
export class ExtractionModule {}
