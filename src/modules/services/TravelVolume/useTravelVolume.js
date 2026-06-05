// Hooks
import { useMemo } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import createValidArray from "utils/createValidArray";
import normalizeDate from "../utils/normalizeDate";


export default function useTravelVolume(params = {}) {
  const services = useGetServices();

  const { selectedYear, selectedMonth } = params;

  const guides = useMemo(() => {
    return createValidArray(services).flatMap(
      (s) => s.guides || []
    );
  }, [services]);

  const years = useMemo(() => {
  const set = new Set();
    guides.forEach((g) => set.add(g.year));

    return [...set].sort((a, b) => a - b);
  }, [guides]);

  const MONTH_ORDER = [
    "Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.",
    "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."
  ];

  const months = useMemo(() => {
  const set = new Set();
  guides.forEach((g) => set.add(g.month));

    return [...set].sort(
      (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
    );
  }, [guides]);
  

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

    years,
    months,
  };
}
