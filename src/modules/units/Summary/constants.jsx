import FleetIcon from "./icons/fleet-icon";
import AlertsIcon from "./icons/alerts-icon";
import  UpcomingExpirationsIcon from "./icons/upcoming-expirations-icon";
//import BarIcon from "./icons/bar-icon";
export const SUMMARY_ITEMS = [
  {
    id: "flota_total",
    title: "FLOTA TOTAL",
    value:"124",
    description: "+4 este mes",
    accent: "default",
    icon: <FleetIcon />,
  },
  {
    id: "alertas_criticas",
    title: "ALERTAS CRITICAS",
    value:"08",
    description: "Documentos vencidos",
    accent: "warning",
    icon: <AlertsIcon />,
  },
  {
    id: "proximos_vencimientos",
    title: "PRÓXIMOS VENCIMIENTOS",
    value:"15",
    description: "Siguientes 30 días",
    accent: "default",
    icon: <UpcomingExpirationsIcon />,
  },
  {
    id: "reporte_cumplimiento",
    title: "Reporte de Cumplimiento",
    value:"94.2%",
  },
];