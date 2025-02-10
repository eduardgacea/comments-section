import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import { PostContextProvider } from "./context/PostContextProvider.tsx";

import App from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostContextProvider>
      <App />
    </PostContextProvider>
  </StrictMode>
);
