import type { ShipEntity } from "../../nestjs/space-trader-api/ships/ship.entity";
import { Cooldown } from "../../nestjs/space-trader-api/types/Cooldown";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Navigation } from "../../nestjs/space-trader-api/types/Navigation";

export interface ShipState {
  commandShip: ShipEntity;
  jumpCooldown: Cooldown;
  navigation: Navigation;
}

const shipSlice = createSlice({
  name: "ship",
  initialState: {} as ShipState,
  reducers: {
    commandShipChanged(state, action: PayloadAction<ShipEntity>) {
      state.commandShip = action.payload;
    },
    jumpCooldownChanged(state, action: PayloadAction<Cooldown>) {
      state.jumpCooldown = action.payload;
    },
    navigationChanged(state, action: PayloadAction<Navigation>) {
      state.navigation = action.payload;
    },
  },
});

const {actions, reducer} = shipSlice;
export const {
  commandShipChanged,
  jumpCooldownChanged,
  navigationChanged,
} = actions;
export {reducer as shipSliceReducer};

export const commandShipSelector = (state: RootState) => state.ship.commandShip;
export const jumpCooldownSelector = (state: RootState) => state.ship.jumpCooldown;
export const navigationSelector = (state: RootState) => state.ship.navigation;
