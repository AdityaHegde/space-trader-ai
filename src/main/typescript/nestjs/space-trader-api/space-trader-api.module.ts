import {Module} from "@nestjs/common";
import {SystemModule} from "./systems/system.module";
import {ShipModule} from "./ships/ship.module";
import {ExtractionModule} from "./extraction/extraction.module";
import {RouterModule} from "@nestjs/core";

const ImportModules = [
  SystemModule,
  ShipModule,
  ExtractionModule
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
