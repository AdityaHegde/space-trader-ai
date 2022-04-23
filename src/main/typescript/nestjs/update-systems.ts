import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {SystemService} from "@space-trader-api/systems/system.service";
import {WaypointService} from "@space-trader-api/systems/waypoint.service";
import { TradeService } from "@space-trader-api/trade/trade.service";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppLogger } from "@nestjs-server/logging/AppLogger";

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(AppLogger));
  const systemService = app.get(SystemService);
  const waypointService = app.get(WaypointService);
  const tradeService = app.get(TradeService);
  const systems = await systemService.updateAllSystems();
  for (const system of systems) {
    console.log(`\nLoading ${system.symbol}`);
    if (!system.charted) continue;
    try {
      const waypoints = await waypointService.updateAllWaypoints(system.symbol);
      waypoints.forEach(waypoint => console.log(`${waypoint.symbol} : ${waypoint.type} (${waypoint.traits.join(",")})`));

      await tradeService.getSystemMarketData(system.symbol, true);
    } catch (err) {
      console.log(err);
    }
  }
})();
