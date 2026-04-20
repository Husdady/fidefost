// Icons
import UnitsIcon from "./icons/units-icon";
import ServicesIcon from "./icons/services-icon";
import ContractsIcon from "./icons/contracts-icon";
import OperatorsIcon from "./icons/operators-icon";

export const NAV_ITEMS = [
  {
    path: "/",
    id: "operators",
    label: "OPERADORES",
    icon: <OperatorsIcon />,
  },
  {
    id: "contracts",
    label: "CONTRATOS",
    path: "/contratos",
    icon: <ContractsIcon />,
  },
  {
    id: "services",
    label: "SERVICIOS",
    path: "/servicios",
    icon: <ServicesIcon />,
  },
  {
    id: "units",
    label: "UNIDADES",
    path: "/unidades",
    icon: <UnitsIcon />,
  },
];
