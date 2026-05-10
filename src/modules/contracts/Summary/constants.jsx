import { useGetContracts } from "context/contracts/useContracts";
import useGpsContractsStore from "context/contracts/gpsContractsStore";
import ExpiredLicensesIcon from "./icons/expired-licenses-icon";
import RiseIcon from "./icons/rise-icon";
import ValidIcon from "./icons/valid-icon";

export default function useSummaryItems(){
   const gpsContracts = useGpsContractsStore(
   (state) => state.gpsContracts);
   const expiredGps = gpsContracts.filter(
      (gps) => {
        const today = new Date();

        const endDate = new Date(
          gps.endDate
        );

        return endDate <= today;
      }
    );
    const gpsExpiringSoon = gpsContracts.filter(
      (gps) => {
        const today = new Date();

        const endDate = new Date(
          gps.endDate
        );

        const diffTime =
          endDate - today;

        const diffDays = Math.ceil(
          diffTime / (1000 * 60 * 60 * 24)
        );

        return diffDays > 0 &&
              diffDays <= 30;
      }
    );
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
        title: "CONTRATOS ACTIVOS",
        value: totaldrivers,
        description: <div style={{color: "#110542",}}> <RiseIcon />  Activos</div>,
        accent: "default",
      },
      {
        id: "conductores",
        title: "CONDUCTORES",
        value: totaldrivers,
        description: <div> <ExpiredLicensesIcon />{" "} {licensesToExpire}{" "} Licencias por vencer </div>,
        accent: "warning",
      },
      {
        id: "unidades_wifi",
        title: "UNIDADES WIFI",
        value: totalWifi,
        description: <div style={{color: "#110542",}}> <ValidIcon />  WiFi</div>,
        accent: "good",
      },
      {
        id: "alertas_gps",
        title: "ALERTAS GPS",
        value: <div> {expiredGps.length} vencidos </div>,
        description: <div style={{color: "#b66a00",}}> <ExpiredLicensesIcon /> {gpsExpiringSoon.length} por vencer </div>,
        accent: "danger",
      },
      
    ];
    
}