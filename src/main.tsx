import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { DeviceContextProvider } from "./context/DeviceContextProvider.tsx";
import { PostContextProvider } from "./context/PostContextProvider.tsx";

import App from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DeviceContextProvider>
      <PostContextProvider>
        <App />
      </PostContextProvider>
    </DeviceContextProvider>
  </StrictMode>
);
