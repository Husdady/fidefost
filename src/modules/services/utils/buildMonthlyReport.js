import calculateTrips from "./calculateTrips";

export default function buildMonthlyReport(guides = []) {
  const groups = {};

  guides.forEach((guide) => {
    const comment = (
        guide.comment || "SIN COMENTARIO"
        )
        .trim()
        .toUpperCase();
    if (!groups[comment]) {
      groups[comment] = {
        comment,

        guides: [],

        provider: guide.provider,
        product: guide.product,
        driver: guide.driver,

        totalGuides: 0,
        };
    }

    groups[comment].guides.push(guide);
    groups[comment].totalGuides += 1;
  });

  Object.values(groups).forEach((group) => {
    group.totalTrips = calculateTrips(group.guides);
  });

  return Object.values(groups);
}