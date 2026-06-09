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

        providers: new Set(),
        products: new Set(),
        drivers: new Set(),

        totalGuides: 0,
        };
    }

    groups[comment].guides.push(guide);
    groups[comment].totalGuides += 1;

    if (guide.provider) {
      groups[comment].providers.add(guide.provider);
    }

    if (guide.product) {
      groups[comment].products.add(guide.product);
    }

    if (guide.driver) {
      groups[comment].drivers.add(guide.driver);
    }
  });

  Object.values(groups).forEach((group) => {
    group.totalTrips = calculateTrips(group.guides);
  });

  return Object.values(groups).map((group) => ({
  ...group,
  provider: [...group.providers].join(", "),
  product: [...group.products].join(", "),
  driver: [...group.drivers].join(", "),
}));
}