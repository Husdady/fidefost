export default function getInsuranceStatus(
  fechaFin
) {

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${
      String(today.getMonth() + 1)
        .padStart(2, "0")
    }-${
      String(today.getDate())
        .padStart(2, "0")
    }`;

  const currentDate =
    new Date(todayString).getTime();

  const endDate =
    new Date(fechaFin).getTime();

  const diffDays =
    Math.trunc(
      (endDate - currentDate) /
      millisecondsPerDay
    );

  // EXPIRADO
  if (diffDays < 0) {
    return {
      status: "EXPIRADO",
      statusClass: "expired",
      dotClass: "dot-danger"
    };
  }

  // PROXIMO A VENCER
  if (diffDays <= 60) {
    return {
      status: "PROX. EXPIRAR",
      statusClass: "warning",
      dotClass: "dot-warning"
    };
  }

  // ACTIVO
  return {
    status: "ACTIVO",
    statusClass: "active",
    dotClass: "dot-success"
  };
}