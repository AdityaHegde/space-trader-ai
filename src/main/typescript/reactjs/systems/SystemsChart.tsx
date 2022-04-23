import type { SystemEntity } from "../../nestjs/space-trader-api/systems/system.entity";
import { useEffect, useRef, useState } from "react";
import { PixiApp } from "./systems-chart/PixiApp";
import { ChartScene } from "./systems-chart/scenes/ChartScene";
import { SystemObject } from "./systems-chart/objects/SystemObject";
import { WaypointObject } from "./systems-chart/objects/WaypointObject";
import {
  appSceneChanged,
  AppSceneState,
  pixiAppCreated,
  systemSelected,
  systemSelector,
  waypointSelected
} from "./systemsSlice";
import { useDispatch, useSelector } from "react-redux";
import { SelectedWaypointComponent } from "./SelectedWaypointComponent";
import { SelectedSystemComponent } from "./SelectedSystemComponent";
import { SectorChartScene } from "./systems-chart/scenes/SectorChartScene";
import { SystemChartScene } from "./systems-chart/scenes/SystemChartScene";
import { SystemChartControls } from "./SystemChartControls";

export interface SystemsChartProps {
  systems: Array<SystemEntity>;
}

export const SystemsChart = ({systems}: SystemsChartProps) => {
  const containerRef = useRef();
  const [app, setApp] = useState<PixiApp>(null);
  const [scene, setScene] = useState<ChartScene>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (containerRef.current && app) {
      app.sceneListener = setScene;
      app.init(containerRef.current);
    }
  }, [containerRef.current, app]);
  useEffect(() => {
    if (systems?.length) {
      const newApp = new PixiApp(systems)
      setApp(newApp);
      dispatch(pixiAppCreated(newApp));
    }
  }, [systems]);
  useEffect(() => {
    if (!scene) return;
    scene.selectedListener = (selectedObject) => {
      if (selectedObject instanceof SystemObject) {
        dispatch(systemSelected(selectedObject.system));
      } else if (selectedObject instanceof WaypointObject) {
        dispatch(waypointSelected(selectedObject.waypoint));
      }
    };
    if (scene instanceof SectorChartScene) {
      dispatch(waypointSelected(null));
      dispatch(appSceneChanged(AppSceneState.Sector));
    } else if (scene instanceof SystemChartScene) {
      dispatch(appSceneChanged(AppSceneState.System));
    }
  }, [scene]);

  return (
    <div>
      <div className="flex justify-center" ref={containerRef} />
      <SystemChartControls />
    </div>
  );
}
