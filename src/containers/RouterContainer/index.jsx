// Librarys
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import Units from "pages/Units";
import Services from "pages/Services";
import Contracts from "pages/Contracts";
import Operators from "pages/Operators";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Operators />,
  },

  {
    path: "/contratos",
    element: <Contracts />,
  },

  {
    path: "/servicios",
    element: <Services />,
  },

  {
    path: "/unidades",
    element: <Units />,
  },
]);

export default function RouterContainer() {
  return <RouterProvider router={router} />;
}
