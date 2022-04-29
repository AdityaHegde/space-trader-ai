import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SpaceTraderApiModule} from "@space-trader-api/space-trader-api.module";
import {ConfigModule} from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { LoggerModule } from "@nestjs-server/logging/LoggerModule";
import { AutomationModule } from "@nestjs-server/automation/automation.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { CooldownEntity } from "@space-trader-api/cooldown/cooldown.entity";
import { SurveyEntity } from "@space-trader-api/extraction/survey.entity";
import { TradeEntity } from "@space-trader-api/trade/trade.entity";
import { FactionEntity } from "@space-trader-api/factions/faction.entity";
import { SystemEntity } from "@space-trader-api/systems/system.entity";
import { WaypointEntity } from "@space-trader-api/systems/waypoint.entity";
import { AutomationEntity } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { TypeORMLogger } from "@nestjs-server/logging/TypeORMLogger";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "spacetrader",
      password: "spacetrader",
      database: "spacetrader",
      port: 5432,
      entities: [
        ShipEntity, FactionEntity,
        SystemEntity, WaypointEntity,
        CooldownEntity, SurveyEntity, TradeEntity,
        AutomationEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
      logger: new TypeORMLogger(),
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    SpaceTraderApiModule,
    AutomationModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "/", "dist", "public"),
    }),
  ],
})
export class AppModule {}
