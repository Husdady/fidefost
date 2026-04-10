// Components
import OfflineView from "components/views/OfflineView";
import NotAccessView from "components/views/NotAccessView";

// Containers
import AppContainer from "containers/AppContainer";

// Hooks
import useMainContainer from "./useMainContainer";

export default function MainContainer() {
  const { isOnline, canAccessToApp } = useMainContainer();

  // User is offline
  if (!isOnline) return <OfflineView />;

  // User can only access in Desktop devices
  if (!canAccessToApp) return <NotAccessView />;

  return <AppContainer />;
}
