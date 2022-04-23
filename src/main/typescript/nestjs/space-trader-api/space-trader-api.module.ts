import {Module} from "@nestjs/common";
import {SystemModule} from "./systems/system.module";
import {ShipModule} from "./ships/ship.module";
import {ExtractionModule} from "./extraction/extraction.module";
import {RouterModule} from "@nestjs/core";
import { TradeModule } from "./trade/trade.module";

const ImportModules = [
  SystemModule,
  ShipModule,
  ExtractionModule,
  TradeModule,
];

@Module({
  imports: [
    ...ImportModules,
    RouterModule.register(ImportModules.map(module => {
      return { path: "/api/space-trader", module }
    })),
  ],
})
export class SpaceTraderApiModule {}
