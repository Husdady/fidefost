import { useGetContracts } from "context/contracts/useContracts";
import useGpsContractsStore from "context/contracts/gpsContractsStore";
import ExpiredLicensesIcon from "./icons/expired-licenses-icon";
import RiseIcon from "./icons/rise-icon";
import ValidIcon from "./icons/valid-icon";

export default function useSummaryItems(){

   const gpsContracts = useGpsContractsStore(
   (state) => state.gpsContracts);
   const today = new Date();
    today.setHours(0,0,0,0);

    const expiredGps = gpsContracts.filter(
      (gps) => {

        const endDate = new Date(
          gps.endDate + "T00:00:00"
        );

        return endDate < today;
      }
    );
    const gpsExpiringSoon = gpsContracts.filter(
  (gps) => {

    const endDate = new Date(
      gps.endDate + "T00:00:00"
    );

    const diffTime =
      endDate - today;

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 &&
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
      new Date(
        audit.auditLicenseExpiration + "T00:00:00"
      );

    const diffTime =
      expirationDate - today;

    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 && diffDays <= 60;

  }).length;

  //contracts activos

const activeContracts = auditContracts.filter((audit) => {

  if (
    !audit?.auditContract?.start ||
    !audit?.auditContract?.end
  ) {
    return false;
  }

  // FECHA INICIO
  const startDate = new Date(
    audit.auditContract.start + "T00:00:00"
  );

  // FECHA FIN
  const endDate = new Date(
    audit.auditContract.end + "T00:00:00"
  );

  // ACTIVO:
  // YA EMPEZÓ Y AÚN NO TERMINA
  return startDate <= today && endDate >= today;
});

const totaldriversactivos = activeContracts.length;

  return [

      {
        id: "contratos_activos",
        title: "CONTRATOS ACTIVOS",
        value: totaldriversactivos,
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
        accent: "default",
      },
      {
        id: "alertas_gps",
        title: "ALERTAS GPS",
        value: <div> {expiredGps.length} <span className="title-gps"> vencidos </span> </div>,
        description: <div style={{color: "#b66a00",}}> <ExpiredLicensesIcon /> {gpsExpiringSoon.length} por vencer </div>,
        accent: "danger",
      },
      
    ];
    
}