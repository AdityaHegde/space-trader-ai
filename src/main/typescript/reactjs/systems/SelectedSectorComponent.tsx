import {SystemEntity} from "../../nestjs/space-trader-api/systems/system.entity";
import {PixiApp} from "./systems-chart/PixiApp";

export const SelectedSectorComponent = ({system, app}: { system: SystemEntity, app: PixiApp }) => {
  if (!system) return <div></div>
  return <div className="text-center">
    <h2 className="text-gray-500 dark:text-gray-200 text-md uppercase mb-4">
      [{system.charted ? "C" : "U"}] {system.symbol} ({system.type})
    </h2>
    <ul>
      <li className="mb-4 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
        [{system.charted ? "Charted" : "Uncharted"}] ({system.waypoints?.length ?? 0})
      </li>
      <li className="mb-4 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
        <a href="#" onClick={() => app.viewSystem(system)}>
          Enter
        </a>
      </li>
    </ul>
  </div>
}