import { useGetContracts } from "components/features/RapidUnitAudit/useContracts";
import ExpiredLicensesIcon from "./icons/expired-licenses-icon";
import RiseIcon from "./icons/rise-icon";
import ValidIcon from "./icons/valid-icon";
import WarningSignIcon from "./icons/warning-sign-icon";


export default function useSummaryItems(){
   const auditContracts = useGetContracts();
   const totaldrivers = auditContracts.length;
   const totalWifi = auditContracts.filter(
    (audit) => audit.wifi === true
    ).length;
   const licensesToExpire =
   auditContracts.filter((audit) => {

    if (!audit.auditLicenseExpiration) {
      return false;
    }

    const today = new Date();

    const expirationDate =
      new Date(audit.auditLicenseExpiration);

    const diffTime =
      expirationDate - today;

    const diffDays =
      diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 59;

  }).length;

  return [

      {
        id: "contratos_activos",
        title: "CONTR. ACTIVOS",
        value: totaldrivers,
        description: <div> <RiseIcon /></div>,
        accent: "default",
      },
      {
        id: "conductores",
        title: "CONDUCTORES",
        value: totaldrivers,
        description: <div> <ExpiredLicensesIcon />{" "} {licensesToExpire}{" "} licencias por vencer </div>,
        accent: "warning",
      },
      {
        id: "unidades_wifi",
        title: "UNIDADES WIFI",
        value: totalWifi,
        description: <div> <ValidIcon /></div>,
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
    
}