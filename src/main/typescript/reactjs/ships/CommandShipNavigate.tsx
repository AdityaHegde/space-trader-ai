import { useDispatch, useSelector } from "react-redux";
import { commandShipSelector, navigationSelector } from "./shipSlice";
import { waypointSelector } from "../systems/systemsSlice";
import { useCountdown } from "../utils/useCountdown";
import { useEffect } from "react";
import { ShipStatus } from "../../commons/GameConstants";
import { navigateShip } from "./shipActions";

export const CommandShipNavigate = () => {
  const commandShip = useSelector(commandShipSelector);
  const navigation = useSelector(navigationSelector);
  const waypoint = useSelector(waypointSelector);
  const dispatch = useDispatch();

  const [countdown, startCountdown] = useCountdown();
  useEffect(() => {
    if (!navigation) return;
    startCountdown(navigation.durationRemaining);
  }, [navigation]);

  if (!waypoint || !commandShip) return <></>;

  return <p className="text-gray-800 dark:text-gray-100 text-xs">
    {(commandShip.location !== waypoint.symbol) ?
      (navigation ?
        <span>Navigating to {waypoint.symbol}. {countdown}s Remaining</span>:
        (commandShip.status === ShipStatus.ORBIT ?
          <a href="#" onClick={() => navigateShip(dispatch, commandShip, waypoint.symbol)}>
            Navigate to {waypoint.symbol}
          </a> : "")
      ) : ""}
  </p>
}
