// Hooks
import { useMemo } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import createValidArray from "utils/createValidArray";

/**
 * Hook for implements logic of TravelVolume component
 */
export default function useTravelVolume() {
  const services = useGetServices();

  // Get total guides and travel/day
  const data = useMemo(() => {
    return createValidArray(services).reduce(
      (accumulator, service) => {
        const totalGuides = Number(service?.totalGuides) || 0;
        const tripsPerDay = Number(service?.tripsPerDay) || 0;
        
        const years = service?.years || [];
        const months = service?.months || [];

        accumulator.totalGuides += totalGuides;
        accumulator.tripsPerDay += tripsPerDay;

        years.forEach((year) =>
          accumulator.years.add(year)
        );

        months.forEach((month) =>
          accumulator.months.add(month)
        );
        
        return accumulator;
      },
      {
        totalGuides: 0,
        tripsPerDay: 0,
        years: new Set(),
        months: new Set(),
      }
    );
  }, [services]);

  // Get trips per day
  const tripsPerDay = useMemo(() => {
    const value = data.tripsPerDay;
    return Number.isInteger(value) ? value : value.toFixed(2);
  }, [data.tripsPerDay]);
  console.log({
  years: [...data.years],
  months: [...data.months],
});

  return {
    tripsPerDay: tripsPerDay,
    totalGuides: data.totalGuides,

    years: [...data.years],
    months: [...data.months],
  };
}
