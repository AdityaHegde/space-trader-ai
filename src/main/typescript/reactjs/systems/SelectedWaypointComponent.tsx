import {MARKETPLACE, SHIPYARD} from "../../commons/GameConstants";
import { useSelector } from "react-redux";
import { pixiAppSelector, systemSelector, waypointSelector } from "./systemsSlice";

export const SelectedWaypointComponent = () => {
  const app = useSelector(pixiAppSelector);
  const system = useSelector(systemSelector);
  const waypoint = useSelector(waypointSelector);
  if (!app || !system || !waypoint) return <div></div>

  return <div className="shadow-lg w-full p-4 bg-white dark:bg-gray-700">
    <p className="text-gray-700 dark:text-white text-lg font-medium mb-2">
      {waypoint.symbol} ({waypoint.type})
    </p>
    <p className="text-black dark:text-white text-xs">
      [{system.charted ? "Charted" : "Uncharted"}]<br/>
      {waypoint.features?.indexOf(MARKETPLACE) > -1 ? "Has Marketplace" : "No Marketplace"}<br/>
      {waypoint.features?.indexOf(SHIPYARD) > -1 ? "Has Shipyard" : "No Shipyard"}
    </p>
  </div>
}
