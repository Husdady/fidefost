// Librarys
import { QueryClient, QueryClientProvider } from "react-query";

// Containers
import MainContainer from "containers/MainContainer";

// Styles
import "./styles.scss";


const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainContainer />
      <div id="portals" />
    </QueryClientProvider>
  );
}