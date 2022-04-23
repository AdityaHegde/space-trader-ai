import { useDispatch, useSelector } from "react-redux";
import { commandShipSelector } from "./shipSlice";
import { ShipStatus } from "../../commons/GameConstants";
import { dockShip, orbitShip } from "./shipActions";

export const CommandShipDockOrOrbit = () => {
  const commandShip = useSelector(commandShipSelector);
  const dispatch = useDispatch();
  if (!commandShip) return <></>;

  return <p className="text-gray-800 dark:text-gray-100 text-xs">
    Status: {commandShip.status}<br />
    {commandShip.status === ShipStatus.ORBIT ?
      <a href="#" onClick={() => dockShip(dispatch, commandShip)}>
        Dock ship
      </a> :
      (commandShip.status === ShipStatus.DOCKED ? <a href="#" onClick={() => orbitShip(dispatch, commandShip)}>
        Orbit ship
      </a> : "")}
  </p>
};
