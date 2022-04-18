import {getDistance} from "../../commons/pointUtils";
import {getCLIResponse} from "../../commons/getCLIResponse";
import {asyncWait} from "../../commons/asyncWait";
import {WaypointService} from "../space-trader-api/systems/waypoint.service";
import {ShipNavigationService} from "../space-trader-api/ships/ship-navigation.service";
import {CLIContext} from "./CLIContext";

export async function navigateShip(context: CLIContext, waypointService: WaypointService, shipNavigationService: ShipNavigationService) {
  console.log("\n");
  const waypoints = await waypointService.getAll(context.shipLocation.system.symbol);
  waypoints.forEach((waypoint, index) => {
    console.log(`[${index}] [${waypoint.type}] ${waypoint.symbol} (${waypoint.x}, ${waypoint.y}) ${getDistance(context.shipLocation, waypoint)}`);
    console.log(`${waypoint.traits.join(",")} ${waypoint.features.join(",")}`)
  });
  const target = waypoints[Number(await getCLIResponse("Select a target: "))];

  if (target.symbol === context.shipLocation.symbol) return;

  const moveResp = await getCLIResponse(`Move to target? ${target.symbol} - ${getDistance(context.shipLocation, target)}? Y?`);
  if (moveResp !== "Y") return;
  const navigate = await shipNavigationService.navigate(context.ship.symbol, target.symbol);
  console.log(`Consumed ${navigate.fuelCost}. Reaching in ${navigate.navigation.durationRemaining}s`);
  await asyncWait(navigate.navigation.durationRemaining * 1000 + 2500);
}
