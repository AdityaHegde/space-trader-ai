import { ShipEntity } from "../../nestjs/space-trader-api/ships/ship.entity";
import axios from "axios";
import { SPACE_TRADER_API_PATH } from "../../commons/constants";
import { AppDispatch } from "../store";
import { commandShipChanged, jumpCooldownChanged, navigationChanged } from "./shipSlice";

export const updateCommandShip = async (dispatch: AppDispatch, commandShip: ShipEntity) => {
  const resp = await axios.get(
    `${SPACE_TRADER_API_PATH}/ships/${commandShip.symbol}`,
  );
  dispatch(commandShipChanged(resp.data));
}

export const jumpShip = async (dispatch: AppDispatch, commandShip: ShipEntity, destination: string) => {
  const resp = await axios.post(
    `${SPACE_TRADER_API_PATH}/ships/${commandShip.symbol}/jump`,
    {destination},
  );
  dispatch(jumpCooldownChanged(resp.data.cooldown));
  setTimeout(() => {
    dispatch(jumpCooldownChanged());
    updateCommandShip(dispatch, commandShip);
  }, resp.data.cooldown.duration * 1000 + 2500);
  await updateCommandShip(dispatch, commandShip);
}

export const navigateShip = async (dispatch: AppDispatch, commandShip: ShipEntity, destination: string) => {
  const resp = await axios.post(
    `${SPACE_TRADER_API_PATH}/ships/${commandShip.symbol}/navigate`,
    {destination},
  );
  dispatch(navigationChanged(resp.data.navigation));
  setTimeout(() => {
    dispatch(navigationChanged());
    updateCommandShip(dispatch, commandShip);
  }, resp.data.navigation.durationRemaining * 1000 + 2500);
  await updateCommandShip(dispatch, commandShip);
}

export const orbitShip = async (dispatch: AppDispatch, commandShip: ShipEntity) => {
  await axios.post(`${SPACE_TRADER_API_PATH}/ships/${commandShip.symbol}/orbit`);
  await updateCommandShip(dispatch, commandShip);
}
export const dockShip = async (dispatch: AppDispatch, commandShip: ShipEntity) => {
  await axios.post(`${SPACE_TRADER_API_PATH}/ships/${commandShip.symbol}/dock`);
  await updateCommandShip(dispatch, commandShip);
}