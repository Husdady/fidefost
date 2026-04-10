// Hooks
import { useState, useEffect } from "react";

// Constants
const MIN_WIDTH = 1025;

/**
 * Hook for check if can access to app
 */
export default function useCanAccessToApp() {
  const [canAccessToApp, setCanAccessToApp] = useState(
    () => window.innerWidth >= MIN_WIDTH
  );

  useEffect(() => {
    const handleResize = () => {
      setCanAccessToApp(window.innerWidth >= MIN_WIDTH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return canAccessToApp;
}
