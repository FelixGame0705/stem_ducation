import { createRoot } from "react-dom/client";
import App, { AppProviders } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
