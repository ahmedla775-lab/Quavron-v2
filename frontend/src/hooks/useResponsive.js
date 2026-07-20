import { useEffect, useState } from "react";

const getDeviceType = () => {
  const width = window.innerWidth;

  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1280) return "laptop";

  return "desktop";
};

export default function useResponsive() {
  const [device, setDevice] = useState(getDeviceType());

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceType());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    device,

    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isLaptop: device === "laptop",
    isDesktop: device === "desktop",

    isSmallScreen:
      device === "mobile" ||
      device === "tablet",
  };
}
