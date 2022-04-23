import { useSelector } from "react-redux";
import { AppSceneState, appSceneStateSelector, pixiAppSelector, systemSelector } from "./systemsSlice";

export const SelectedSystemComponent = () => {
  const app = useSelector(pixiAppSelector);
  const appSceneState = useSelector(appSceneStateSelector);
  const system = useSelector(systemSelector);
  if (!app || !system) return <div></div>;

  return <div className="shadow-lg w-full p-4 bg-gray-100 dark:bg-gray-600">
    <p className="text-gray-800 dark:text-gray-100 text-lg font-medium mb-2">
      {system.symbol} ({system.type})
    </p>
    <p className="text-gray-800 dark:text-gray-100 text-xs">
      [{system.charted ? "Charted" : "Uncharted"}] {system.waypoints?.length ?? 0} Waypoint(s)
    </p>
    <p className="text-gray-800 dark:text-gray-100 text-xl font-medium">
      {appSceneState === AppSceneState.System ?
        <a href="#" onClick={() => app.viewSector()}>
          Exit
        </a> :
        <a href="#" onClick={() => app.viewSystem(system)}>
          Enter
        </a>}
    </p>
  </div>
}
