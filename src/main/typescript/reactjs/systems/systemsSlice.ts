import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SystemEntity } from "../../nestjs/space-trader-api/systems/system.entity";
import type { WaypointEntity } from "../../nestjs/space-trader-api/systems/waypoint.entity";
import type { RootState } from "../store";
import { PixiApp } from "./systems-chart/PixiApp";

export enum AppSceneState {
  Sector,
  System,
}

export interface SystemsState {
  app: PixiApp;
  appSceneState: AppSceneState;
  system: SystemEntity;
  waypoint: WaypointEntity;
}

const systemsSlice = createSlice({
  name: "system",
  initialState: {} as SystemsState,
  reducers: {
    pixiAppCreated(state, action: PayloadAction<PixiApp>) {
      state.app = action.payload as any;
    },
    appSceneChanged(state, action: PayloadAction<AppSceneState>) {
      state.appSceneState = action.payload;
    },
    systemSelected(state, action: PayloadAction<SystemEntity>) {
      state.system = action.payload;
    },
    waypointSelected(state, action: PayloadAction<WaypointEntity>) {
      state.waypoint = action.payload;
    },
  },
});

const {actions, reducer} = systemsSlice;
export const {
  pixiAppCreated, appSceneChanged,
  systemSelected, waypointSelected,
} = actions;
export {reducer as systemsSliceReducer};

export const pixiAppSelector = (state: RootState) => state.systems.app;
export const appSceneStateSelector = (state: RootState) => state.systems.appSceneState;
export const systemSelector = (state: RootState) => state.systems.system;
export const waypointSelector = (state: RootState) => state.systems.waypoint;
