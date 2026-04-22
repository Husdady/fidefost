import ExpiredLicensesIcon from "./icons/expired-licenses-icon";
import RiseIcon from "./icons/rise-icon";
import ValidIcon from "./icons/valid-icon";
import WarningSignIcon from "./icons/warning-sign-icon";


export const SUMMARY_ITEMS = [
  {
    id: "contratos_activos",
    title: "CONTRATOS ACTIVOS",
    value: "1,284",
    description: <div> <RiseIcon /> 12 este mes</div>,
    accent: "default",
  },
  {
    id: "conductores",
    title: "CONDUCTORES",
    value: "3,490",
    description: <div> <ExpiredLicensesIcon /> 15 licencias por vencer </div>,
    accent: "warning",
  },
  {
    id: "unidades_wifi",
    title: "UNIDADES WIFI",
    value: "94%",
    description: <div> <ValidIcon /> Servicio óptimo </div>,
    accent: "good",
  },
  {
    id: "alertas_gps",
    title: "ALERTAS GPS",
    value: "08",
    description: <div> <WarningSignIcon /> sin señal 4hrs </div>,
    accent: "danger",
  },
];