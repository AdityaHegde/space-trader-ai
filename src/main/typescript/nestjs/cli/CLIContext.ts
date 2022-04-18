import {ShipEntity} from "../space-trader-api/ships/ship.entity";
import {WaypointEntity} from "../space-trader-api/systems/waypoint.entity";

export interface CLIContext {
  ship: ShipEntity;
  shipLocation: WaypointEntity;
}
