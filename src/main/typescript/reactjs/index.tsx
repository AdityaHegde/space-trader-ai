import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import {App} from "./App";
import { Provider } from "react-redux";
import { appStore } from "./store";
const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Provider store={appStore}>
      <App />
    </Provider>
  </BrowserRouter>
);
