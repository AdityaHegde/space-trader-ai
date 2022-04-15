import {CacheModule, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShipEntity} from "./ship.entity";
import {SpaceTraderClientModule} from "../space-trader-client/space-trader-client.module";
import {ShipService} from "./ship.service";
import {ShipNavigationService} from "./ship-navigation.service";
import {ExtractionService} from "./extraction.service";
import {SurveyEntity} from "./survey.entity";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([ShipEntity, SurveyEntity]),
    SpaceTraderClientModule,
  ],
  providers: [
    ShipService,
    ShipNavigationService,
    ExtractionService,
  ],
  exports: [
    TypeOrmModule,
    ShipService,
    ShipNavigationService,
    ExtractionService,
  ],
})
export class ShipModule {}
