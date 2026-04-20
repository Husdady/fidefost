// Components
import NotAccessView from "components/views/NotAccessView";

// Containers
import RouterContainer from "containers/RouterContainer";

// Hooks
import useCanAccessToApp from "./hooks/useCanAccessToApp";

export default function MainContainer() {
  const canAccessToApp = useCanAccessToApp();

  // User can only access in Desktop devices
  if (!canAccessToApp) return <NotAccessView />;

  return <RouterContainer />;
}
