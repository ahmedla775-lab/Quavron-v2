import { useEffect, useState } from "react";

export default function useMobile() {
  const [mobile, setMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    function resize() {
      setMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", resize);

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );
  }, []);

  return mobile;
}
