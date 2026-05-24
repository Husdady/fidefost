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

        accumulator.totalGuides += totalGuides;
        accumulator.tripsPerDay += tripsPerDay;

        return accumulator;
      },
      {
        totalGuides: 0,
        tripsPerDay: 0,
      }
    );
  }, [services]);

  // Get trips per day
  const tripsPerDay = useMemo(() => {
    const value = data.tripsPerDay;
    return Number.isInteger(value) ? value : value.toFixed(2);
  }, [data.tripsPerDay]);

  return {
    tripsPerDay: tripsPerDay,
    totalGuides: data.totalGuides,
  };
}
