import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SpaceTraderApiModule} from "./space-trader-api/space-trader-api.module";
import {ViewModule} from "./view/view.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      username: "postgres",
      password: "password",
      database: "postgres",
      port: 5432,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ViewModule,
    SpaceTraderApiModule,
  ],
})
export class AppModule {}
