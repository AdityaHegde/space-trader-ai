import {CacheModule, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShipEntity} from "./ship.entity";
import {SpaceTraderClientModule} from "../space-trader-client/space-trader-client.module";
import {ShipService} from "./ship.service";
import {ShipNavigationService} from "./ship-navigation.service";
import {ExtractionModule} from "../extraction/extraction.module";
import {ShipController} from "./ship.controller";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([ShipEntity]),
    SpaceTraderClientModule,
    ExtractionModule,
  ],
  controllers: [
    ShipController,
  ],
  providers: [
    ShipService,
    ShipNavigationService,
  ],
  exports: [
    TypeOrmModule,
    ShipService,
    ShipNavigationService,
  ],
})
export class ShipModule {}
