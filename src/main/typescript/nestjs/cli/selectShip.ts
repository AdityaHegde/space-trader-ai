import {getCLIResponse} from "../../commons/getCLIResponse";
import {parseLocation} from "../../commons/parseLocation";
import {ShipService} from "../space-trader-api/ships/ship.service";
import {WaypointService} from "../space-trader-api/systems/waypoint.service";
import {CLIContext} from "./CLIContext";

export async function selectShip(context: CLIContext, shipService: ShipService, waypointService: WaypointService) {
  const ships = await shipService.getAll();
  ships.forEach((ship, index) => console.log(`[${index}] ${ship.symbol} ${ship.location}`));
  const selectedShip = ships.length === 1 ? ships[0] : ships[Number(await getCLIResponse("Select a ship: "))];
  const ship = await shipService.update(selectedShip.symbol);
  const {system} = parseLocation(ship.location);

  context.ship = ship;
  context.shipLocation = await waypointService.get(system, ship.location);

  return context;
}
