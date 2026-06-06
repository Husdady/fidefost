// Hooks
import { useMemo } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import createValidArray from "utils/createValidArray";
import normalizeDate from "../utils/normalizeDate";

const MONTH_ORDER = [
    "Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.",
    "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."
  ];

export default function useTravelVolume(params = {}) {
  const services = useGetServices();

  const { selectedYear, selectedMonth } = params;

  const guides = useMemo(() => {
    return createValidArray(services).flatMap(
      (s) => s.guides || []
    );
  }, [services]);

  const calendar = useMemo(() => {
    const map = {};

    guides.forEach((g) => {
      if (!map[g.year]) {
        map[g.year] = new Set();
      }

      map[g.year].add(g.month);
    });

    return map;
  }, [guides]);

  const calendarData = useMemo(() => {
    return Object.keys(calendar)
      .sort((a, b) => a - b)
      .map((year) => ({
        year: Number(year),
        months: [...calendar[year]].sort(
          (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
        ),
      }));
  }, [calendar]);
  

  const filteredGuides = useMemo(() => {

    const result = guides.filter((g) => {
      const matchYear =
        selectedYear === "Todos" ||
        g.year === selectedYear;

      const matchMonth =
        selectedMonth === "Todos" ||
        g.month === selectedMonth;
      return matchYear && matchMonth;
    });
    console.log("FILTERED GUIDES:", result);

  return result;
    
  }, [guides, selectedYear, selectedMonth]);

  const months = useMemo(() => {
  const set = new Set();

  guides
    .filter((g) =>
      selectedYear === "Todos"
        ? true
        : g.year === selectedYear
    )
    .forEach((g) => set.add(g.month));

  return [...set].sort(
    (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
  );
}, [guides, selectedYear]);

  const data = useMemo(() => {
    const travelDays = new Set();

    const totalGuides = filteredGuides.length;

    filteredGuides.forEach((g) => {
      const d = normalizeDate(g.date);

      if (d instanceof Date && !isNaN(d)) {
        travelDays.add(
          d.toISOString().slice(0, 10)
        );
      }
    });

    return {
      totalGuides,
      tripsPerDay: travelDays.size
        ? totalGuides / travelDays.size
        : 0,
    };
  }, [filteredGuides]);

  const tripsPerDay = useMemo(() => {
    const value = data.tripsPerDay;
    return Number.isInteger(value)
      ? value
      : value.toFixed(2);
  }, [data.tripsPerDay]);

  return {
    totalGuides: data.totalGuides,
    tripsPerDay,

    calendarData,
  };
}
