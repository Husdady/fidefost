// Icons
import PendingIcon from "./icons/pending-icon";
import ExpiredIcon from "./icons/expired-icon";
import ValidatedIcon from "./icons/validated-icon";
import TotalOperatorsIcon from "./icons/total-operators-icon";

export const SUMMARY_ITEMS = [
  {
    id: "total",
    title: "TOTAL",
    value: 142,
    description: "Operadores activos",
    accent: "default",
    icon: <TotalOperatorsIcon />,
  },
  {
    id: "validated",
    title: "SALUDABLES",
    value: 128,
    description: "Documentación al día",
    accent: "info",
    icon: <ValidatedIcon />,
  },
  {
    id: "pending",
    title: "EN RIESGO",
    value: 14,
    description: "Requieren atención",
    accent: "warning",
    icon: <PendingIcon />,
  }
];
