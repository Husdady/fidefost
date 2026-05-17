import FleetIcon from "./icons/fleet-icon";
import AlertsIcon from "./icons/alerts-icon";
import  UpcomingExpirationsIcon from "./icons/upcoming-expirations-icon";
//import BarIcon from "./icons/bar-icon";
export const SUMMARY_ITEMS = [
  {
    id: "flota_total",
    title: "FLOTA TOTAL",
    value:"0",
    description: "",
    accent: "default",
    icon: <FleetIcon />,
  },
  {
    id: "alertas_criticas",
    title: "ALERTAS CRITICAS",
    value:"0",
    description: " vencidos",
    accent: "warning",
    icon: <AlertsIcon />,
  },
  {
    id: "proximos_vencimientos",
    title: "PROXIMOS VENCIMIENTOS",
    value:"0",
    description: "",
    accent: "default",
    icon: <UpcomingExpirationsIcon />,
  },
  {
    id: "",
    title: "",
    value:"",
  },
];