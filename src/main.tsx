import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AppMachineContext } from "./appMachine.ts";
import "./index.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppMachineContext.Provider>
      <App />
      <Toaster />
    </AppMachineContext.Provider>
  </StrictMode>
);
