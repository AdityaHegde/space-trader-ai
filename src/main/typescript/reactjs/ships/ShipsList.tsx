import {useEffect, useState} from "react";
import type {ShipEntity} from "../../nestjs/space-trader-api/ships/ship.entity";
import axios from "axios";
import {SPACE_TRADER_API_PATH} from "../../commons/constants";

export const ShipsList = ({shipSelected}: {shipSelected: (ship: ShipEntity) => void}) => {
  const [ships, setShips] = useState<Array<ShipEntity>>([]);
  const [selected, setSelected] = useState<string>(null);

  useEffect(() => {
    axios.get(`${SPACE_TRADER_API_PATH}/ships`).then(resp => setShips(resp.data));
  }, []);

  const shipNameClicked = (ship: ShipEntity) => {
    setSelected(ship.symbol);
    shipSelected(ship);
  };

  return <div className="bg-white h-full dark:bg-gray-700">
    <div className="flex flex-col sm:flex-row sm:justify-around">
      <div className="w-72 h-screen">
        <div className="flex items-center justify-start mx-6 mt-10">
          <span className="text-gray-600 dark:text-gray-300 ml-4 text-2xl font-bold">
            My Ships
          </span>
        </div>
        <nav className="mt-10 px-6">
          {ships.map(ship => <a className={
            "hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 " +
            "transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200" +
            (selected === ship.symbol ?
              "border-r-2 border-gray-600 dark:border-gray-300 text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-600" :
              "text-gray-600 dark:text-gray-400")
          } href="#" onClick={() => shipNameClicked(ship)}>
            <span className="mx-4 text-lg font-normal">
              {ship.symbol}
            </span>
            <span className="flex-grow text-right">
              ({ship.location})
            </span>
          </a>)}
        </nav>
      </div>
    </div>
  </div>
}
