export default function getRevisionStatus(fecha) {

  if (!fecha) {
    return "badge-danger";
  }

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
    new Date(fecha).getTime();

  const diffDays =
    Math.trunc(
      (endDate - currentDate) /
      millisecondsPerDay
    );

  if (diffDays < 0) {
    return "badge-danger";
  }

  if (diffDays <= 60) {
    return "badge-warning";
  }

  return "badge-success";
}