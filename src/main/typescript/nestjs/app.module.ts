import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SpaceTraderApiModule} from "./space-trader-api/space-trader-api.module";
import {ConfigModule} from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

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
    SpaceTraderApiModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "/", "dist", "public"),
    }),
  ],
})
export class AppModule {}
