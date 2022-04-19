import {useEffect, useState} from "react";
import {SystemEntity} from "../nestjs/space-trader-api/systems/system.entity";
import axios, {AxiosResponse} from "axios";
import {SPACE_TRADER_API_PATH} from "../commons/constants";
import {ShipsList} from "./ships/ShipsList";
import {SystemsChart} from "./systems/SystemsChart";

export const App = () => {
  const [systems, setSystems] = useState<Array<SystemEntity>>([]);
  const [selected, setSelected] = useState<string>(null);

  useEffect(() => {
    axios.get(`${SPACE_TRADER_API_PATH}/systems`).then(async (resp: AxiosResponse<Array<SystemEntity>>) => {
      await Promise.all(resp.data.map(async (system) => {
        if (!system.charted) return;
        system.waypoints = (await axios.get(`${SPACE_TRADER_API_PATH}/systems/${system.symbol}`)).data;
      }))
      setSystems(resp.data);
    });
  }, []);

  const shipSelected = (ship) => {
    setSelected(ship);
  };

  return <main className="bg-gray-100 dark:bg-gray-800 h-screen overflow-hidden relative">
    <div className="flex items-start justify-between">
      <div className="h-screen hidden lg:block shadow-lg relative w-72"><ShipsList shipSelected={shipSelected} /></div>
      <div className="flex flex-col w-full md:space-y-4"><SystemsChart systems={systems} /></div>
      <div className="h-screen hidden lg:block shadow-lg relative w-72"></div>
    </div>
  </main>
}
