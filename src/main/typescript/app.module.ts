import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SystemModule} from "./systems/system.module";
import {ShipModule} from "./ships/ship.module";

@Module({
  imports: [
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
    SystemModule,
    ShipModule,
  ],
})
export class AppModule {}
