import {CacheModule, Module} from "@nestjs/common";
import {SystemService} from "./system.service";
import {WaypointService} from "./waypoint.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {WaypointEntity} from "./waypoint.entity";
import {SystemEntity} from "./system.entity";
import {SpaceTraderClientModule} from "../space-trader-client/space-trader-client.module";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([SystemEntity, WaypointEntity]),
    SpaceTraderClientModule,
  ],
  providers: [
    SystemService,
    WaypointService,
  ],
  exports: [
    TypeOrmModule,
    SystemService,
    WaypointService,
  ],
})
export class SystemModule {}
