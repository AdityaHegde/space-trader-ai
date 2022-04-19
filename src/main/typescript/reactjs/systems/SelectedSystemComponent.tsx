import {SystemEntity} from "../../nestjs/space-trader-api/systems/system.entity";
import {WaypointEntity} from "../../nestjs/space-trader-api/systems/waypoint.entity";
import {PixiApp} from "./systems-chart/PixiApp";
import {MARKETPLACE, SHIPYARD} from "../../commons/GameConstants";

export interface SelectedSystemComponentProps {
  system: SystemEntity;
  waypoint: WaypointEntity;
  app: PixiApp;
}

export const SelectedSystemComponent = ({ system, waypoint, app }: SelectedSystemComponentProps) => {
  if (!system || !waypoint) return <div></div>
  return <div className="text-center">
    <h2 className="text-gray-500 dark:text-gray-200 text-md uppercase mb-4">
      [{waypoint.charted ? "C" : "U"}] {waypoint.symbol} ({waypoint.type})
    </h2>
    <ul>
      <li className="mb-4 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
        {waypoint.features?.indexOf(MARKETPLACE) > -1 ? "Has Marketplace" : "No Marketplace"}
      </li>
      <li className="mb-4 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
        {waypoint.features?.indexOf(SHIPYARD) > -1 ? "Has Shipyard" : "No Shipyard"}
      </li>
      <li className="mb-4 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
        <a href="#" onClick={() => app.viewSector()}>
          Back
        </a>
      </li>
    </ul>
  </div>
}
