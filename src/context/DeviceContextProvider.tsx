import { useScreenWidth } from "../hooks/useScreenWidth";
import { DEVICE_BREAKPOINTS } from "../config";
import { Device } from "../types/device";
import { createContext } from "react";

const DeviceContext = createContext<{ device: Device }>({
  device: undefined,
});

function DeviceContextProvider({ children }: { children: React.ReactNode }) {
  const width = useScreenWidth();

  const device: Device = width >= DEVICE_BREAKPOINTS.MOBILE ? "desktop" : "mobile";

  return <DeviceContext.Provider value={{ device }}>{children}</DeviceContext.Provider>;
}

export { DeviceContext, DeviceContextProvider };
