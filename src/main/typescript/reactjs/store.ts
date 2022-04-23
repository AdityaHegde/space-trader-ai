import { configureStore } from "@reduxjs/toolkit";
import { systemsSliceReducer } from "./systems/systemsSlice";
import { shipSliceReducer } from "./ships/shipSlice";

export const appStore = configureStore({
  reducer: {
    systems: systemsSliceReducer,
    ship: shipSliceReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
