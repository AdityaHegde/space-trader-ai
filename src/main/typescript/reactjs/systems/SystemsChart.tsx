import type {SystemEntity} from "../../nestjs/space-trader-api/systems/system.entity";
import {useEffect, useRef, useState} from "react";
import {PixiApp} from "./systems-chart/PixiApp";
import {SystemChartScene} from "./systems-chart/scenes/SystemChartScene";
import {SectorChartScene} from "./systems-chart/scenes/SectorChartScene";
import {SelectedSectorComponent} from "./SelectedSectorComponent";
import {SelectedSystemComponent} from "./SelectedSystemComponent";
import {ChartScene} from "./systems-chart/scenes/ChartScene";
import {ChartObject} from "./systems-chart/objects/ChartObject";
import {SystemObject} from "./systems-chart/objects/SystemObject";
import {WaypointObject} from "./systems-chart/objects/WaypointObject";

export interface SystemsChartProps {
  systems: Array<SystemEntity>;
}

export const SystemsChart = ({systems}: SystemsChartProps) => {
  const containerRef = useRef();
  const [app, setApp] = useState<PixiApp>(null);
  const [scene, setScene] = useState<ChartScene>(null);
  const [selected, setSelected] = useState<ChartObject>(null);

  useEffect(() => {
    if (containerRef.current && app) {
      app.sceneListener = setScene;
      app.init(containerRef.current);
    }
  }, [containerRef.current, app]);
  useEffect(() => {
    if (systems?.length) {
      setApp(new PixiApp(systems));
    }
  }, [systems]);
  useEffect(() => {
    if (scene) scene.selectedListener = setSelected;
  }, [scene]);

  const selectedEntity = selected instanceof SystemObject ?
    <SelectedSectorComponent system={selected?.system} app={app} /> :
    (selected instanceof WaypointObject ?
      <SelectedSystemComponent system={selected?.system}
                               waypoint={selected?.waypoint} app={app}/> :
      "");

  return (
    <div>
      <div ref={containerRef} />
      <footer className="bg-white dark:bg-gray-800 w-full py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="text-lg font-light pb-8 flex flex-wrap justify-center">
            <li className="w-1/2 md:w-1/3 lg:w-1/3">
              {selectedEntity}
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
