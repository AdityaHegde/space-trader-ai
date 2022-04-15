import {Module} from "@nestjs/common";
import {RateLimiter} from "./RateLimiter";
import {SpaceTraderHttpService} from "./space-trader-http.service";
import {SpaceTraderConfig} from "../config/SpaceTraderConfig";

@Module({
  providers: [
    RateLimiter,
    SpaceTraderHttpService,
    SpaceTraderConfig,
  ],
  exports: [SpaceTraderHttpService],
})
export class SpaceTraderClientModule {}
