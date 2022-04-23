import { useSelector } from "react-redux";
import { commandShipSelector } from "./shipSlice";
import { CommandShipJump } from "./CommandShipJump";
import { CommandShipNavigate } from "./CommandShipNavigate";
import { CommandShipDockOrOrbit } from "./CommandShipDockOrOrbit";

export const CommandShip = () => {
  const commandShip = useSelector(commandShipSelector);
  if (!commandShip) return <></>;

  return <div className="shadow-lg w-full p-4 bg-gray-100 dark:bg-gray-600">
    <span className="text-gray-600 dark:text-gray-300 ml-4 text-2xl font-bold">
      Command Ship: {commandShip.symbol}
    </span>
    <br />
    <span className="text-gray-600 dark:text-gray-300 ml-4">
      At: {commandShip.location}
    </span>
    <CommandShipJump />
    <CommandShipNavigate />
    <CommandShipDockOrOrbit />
  </div>
}
