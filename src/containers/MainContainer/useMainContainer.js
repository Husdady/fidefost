// Hooks
import useNetwork from "hooks/useNetwork";
import useCanAccessToApp from "./hooks/useCanAccessToApp";

/**
 * Hook for implements logic of MainContainer component
 */
export default function useMainContainer() {
  const isOnline = useNetwork();
  const canAccessToApp = useCanAccessToApp();

  return {
    isOnline: isOnline,
    canAccessToApp: canAccessToApp,
  };
}
