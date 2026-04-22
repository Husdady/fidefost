import ExpiredLicensesIcon from "./icons/expired-licenses-icon";
import RiseIcon from "./icons/rise-icon";
import ValidIcon from "./icons/valid-icon";
import WarningSignIcon from "./icons/warning-sign-icon";

export const SUMMARY_ITEMS = [
  {
    id: "contratos_activos",
    title: "CONTRATOS ACTIVOS",
    value: "1,284",
    description: "12% este mes",
    accent: "default",
    icon: <RiseIcon />,
  },
  {
    id: "conductores",
    title: "CONDUCTORES",
    value: "3,490",
    description: "15 licencias por vencer",
    accent: "warning",
    icon: <ExpiredLicensesIcon />, 
  },
  {
    id: "unidades_wifi",
    title: "UNIDADES WIFI",
    value: "94%",
    description: "Servicio óptimo",
    accent: "good",
    icon: <ValidIcon />,
  },
  {
    id: "alertas_gps",
    title: "ALERTAS GPS",
    value: "08",
    description: "Servicio óptimo",
    accent: "danger",
    icon: <WarningSignIcon />,
  },
];