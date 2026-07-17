import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import "./styles/theme.css";
import App from "./App.tsx";
import { AppProviders } from "./AppProviders.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
