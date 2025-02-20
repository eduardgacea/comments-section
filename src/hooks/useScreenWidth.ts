import { useEffect, useState } from "react";

export function useScreenWidth() {
  const [width, setWidth] = useState(window.screen.width);

  useEffect(() => {
    const handleResize = () => setWidth(window.screen.width);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
