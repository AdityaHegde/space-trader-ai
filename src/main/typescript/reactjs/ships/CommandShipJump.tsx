import { useDispatch, useSelector } from "react-redux";
import { commandShipSelector, jumpCooldownSelector } from "./shipSlice";
import { systemSelector } from "../systems/systemsSlice";
import { jumpShip } from "./shipActions";
import { useCountdown } from "../utils/useCountdown";
import { useEffect } from "react";
import { parseLocation } from "../../commons/parseLocation";

export const CommandShipJump = () => {
  const commandShip = useSelector(commandShipSelector);
  const jumpCooldown = useSelector(jumpCooldownSelector);
  const system = useSelector(systemSelector);
  const dispatch = useDispatch();

  const [countdown, startCountdown] = useCountdown();
  useEffect(() => {
    if (!jumpCooldown) return;
    startCountdown(jumpCooldown.duration);
  }, [jumpCooldown]);

  if (!system || !commandShip) return <></>;

  const location = parseLocation(commandShip.location);

  return <p className="text-gray-800 dark:text-gray-100 text-xs">
    {(location.system !== system.symbol) ?
      (jumpCooldown ?
        <span>Jump on cooldown for {countdown}</span> :
        <a href="#" onClick={() => jumpShip(dispatch, commandShip, system.symbol)}>
          Jump To {system.symbol}
        </a>
      ) : ""}
  </p>;
}
