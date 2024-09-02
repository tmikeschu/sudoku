import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { AppMachineContext } from "./appMachine.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <AppMachineContext.Provider>
        <App />
      </AppMachineContext.Provider>
    </Theme>
  </StrictMode>
);
