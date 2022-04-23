import {useEffect, useState} from "react";
import type {SystemEntity} from "../nestjs/space-trader-api/systems/system.entity";
import axios, {AxiosResponse} from "axios";
import {SPACE_TRADER_API_PATH} from "../commons/constants";
import {CommandShip} from "./ships/CommandShip";
import {SystemsChart} from "./systems/SystemsChart";
import { SelectedSystemComponent } from "./systems/SelectedSystemComponent";
import { SelectedWaypointComponent } from "./systems/SelectedWaypointComponent";
import { ShipType } from "../commons/GameConstants";
import type { ShipEntity } from "../nestjs/space-trader-api/ships/ship.entity";
import { useDispatch } from "react-redux";
import { updateCommandShip } from "./ships/shipActions";

export const App = () => {
  const [systems, setSystems] = useState<Array<SystemEntity>>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${SPACE_TRADER_API_PATH}/systems`).then(async (resp: AxiosResponse<Array<SystemEntity>>) => {
      await Promise.all(resp.data.map(async (system) => {
        if (!system.charted) return;
        system.waypoints = (await axios.get(`${SPACE_TRADER_API_PATH}/systems/${system.symbol}`)).data;
      }))
      setSystems(resp.data);
    });
    axios.get(`${SPACE_TRADER_API_PATH}/ships`).then((resp: AxiosResponse<Array<ShipEntity>>) => {
      updateCommandShip(dispatch, resp.data.find(ship => ship.registration.role === ShipType.COMMAND));
    });
  }, []);

  return <main className="bg-gray-100 dark:bg-gray-800 h-screen overflow-hidden relative">
    <div className="flex items-start justify-between">
      <div className="h-screen hidden lg:block shadow-lg relative w-96">
        <div className="bg-white h-full dark:bg-gray-700">
          <CommandShip />
        </div>
      </div>
      <div className="w-2/4 md:space-y-4"><SystemsChart systems={systems} /></div>
      <div className="h-screen hidden lg:block shadow-lg relative w-96">
        <div className="bg-white h-full dark:bg-gray-700">
          <SelectedSystemComponent />
          <SelectedWaypointComponent />
        </div>
      </div>
    </div>
  </main>
}
