import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShipEntity} from "./ship.entity";
import {SpaceTraderClientModule} from "../space-trader-client/space-trader-client.module";
import {ShipService} from "./ship.service";
import {ShipNavigationService} from "./ship-navigation.service";
import {ExtractionModule} from "../extraction/extraction.module";
import {ShipController} from "./ship.controller";
import { CooldownModule } from "@space-trader-api/cooldown/cooldown.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipEntity]),
    SpaceTraderClientModule,
    ExtractionModule,
    CooldownModule,
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
