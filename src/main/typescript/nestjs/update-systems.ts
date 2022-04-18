import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {SystemService} from "./space-trader-api/systems/system.service";
import {WaypointService} from "./space-trader-api/systems/waypoint.service";

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const systemService = app.get(SystemService);
  const waypointService = app.get(WaypointService);
  const systems = await systemService.updateAllSystems();
  for (const system of systems) {
    console.log(`\nLoading ${system.symbol}`);
    if (!system.charted) continue;
    try {
      const waypoints = await waypointService.updateAllWaypoints(system.symbol);
      waypoints.forEach(waypoint => console.log(`${waypoint.symbol} : ${waypoint.type} (${waypoint.traits.join(",")})`));
    } catch (err) {
      console.log(err);
    }
  }
})();
