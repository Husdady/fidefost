import { useGetUnits } from "context/units/useUnits";
import { useGetInsurance } from "context/contracts/useInsurance";

import FleetIcon from "./icons/fleet-icon";
import AlertsIcon from "./icons/alerts-icon";
import  UpcomingExpirationsIcon from "./icons/upcoming-expirations-icon";

export default function useSummaryUnits(){
  const units = useGetUnits();
  const insuranceContracts = useGetInsurance();

  const expiredCount =
    insuranceContracts.filter((insurance) => {

      const millisecondsPerDay =
        1000 * 60 * 60 * 24;

      const today = new Date();

      const todayString =
        `${today.getFullYear()}-${
          String(today.getMonth() + 1).padStart(2, "0")
        }-${
          String(today.getDate()).padStart(2, "0")
        }`;

      const currentDate =
        new Date(todayString).getTime();

      const endDate =
        new Date(insurance.fechaFin).getTime();

      const diffDays =
        Math.trunc(
          (endDate - currentDate) /
          millisecondsPerDay
        );

      return diffDays < 0;

    }).length;
  
  const upcomingCount =
  insuranceContracts.filter((insurance) => {

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const today = new Date();

    const todayString =
      `${today.getFullYear()}-${
        String(today.getMonth() + 1).padStart(2, "0")
      }-${
        String(today.getDate()).padStart(2, "0")
      }`;

    const currentDate =
      new Date(todayString).getTime();

    const endDate =
      new Date(insurance.fechaFin).getTime();

    const diffDays =
      Math.trunc(
        (endDate - currentDate) /
        millisecondsPerDay
      );

    return (
      diffDays <= 59 &&
      diffDays >= 0
    );

  }).length;

  return [
  {
    id: "flota_total",
    title: "FLOTA TOTAL",
    value: <div>{units.length}</div>,
    description: "UNIDADES",
    accent: "default",
    icon: <FleetIcon />,
  },
  {
    id: "alertas_criticas",
    title: "ALERTAS CRITICAS",
    value: expiredCount,
    description: "Documentos vencidos",
    accent: "warning",
    icon: <AlertsIcon />,
  },
  {
    id: "proximos_vencimientos",
    title: "PROXIMOS VENCIMIENTOS",
    value: upcomingCount,
    description: "Documentos por vencer",
    accent: "default",
    icon: <UpcomingExpirationsIcon />,
  },
  {
    id: "",
    title: "",
    value:"",
  },
];
}