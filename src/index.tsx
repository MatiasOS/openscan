// RainbowKit styles must be imported early to ensure they're loaded before components render
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import App from "./App";
import { AppContextProvider } from "./context/AppContext";
import { NotificationProvider } from "./context/NotificationContext";
import { networkConfig } from "./utils/networkConfig";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <WagmiProvider config={networkConfig}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
