import { CacheModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SpaceTraderClientModule } from "../space-trader-client/space-trader-client.module";
import { TradeEntity } from "./trade.entity";
import { TradeService } from "./trade.service";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([TradeEntity]),
    SpaceTraderClientModule,
  ],
  providers: [
    TradeService,
  ],
  exports: [
    TypeOrmModule,
    TradeService,
  ],
})
export class TradeModule {}
