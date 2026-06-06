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

  const { selectedYear, selectedMonth, selectedDay, } = params;

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

    const date =
      normalizeDate(g.date);

    const matchDay =
      selectedDay === "Todos" ||
      date?.getDate() === selectedDay;

    return (
      matchYear &&
      matchMonth &&
      matchDay
    );
    });
    console.log("FILTERED GUIDES:", result);

  return result;
    
  }, [guides, selectedYear, selectedMonth, selectedDay,]);

const days = useMemo(() => {
  const set = new Set();

  guides
    .filter((g) => {
      const matchYear =
        selectedYear === "Todos" ||
        g.year === selectedYear;

      const matchMonth =
        selectedMonth === "Todos" ||
        g.month === selectedMonth;

      return matchYear && matchMonth;
    })
    .forEach((g) => {
      const d = normalizeDate(g.date);

      if (d) {
        set.add(d.getDate());
      }
    });

  return [...set].sort((a, b) => a - b);
}, [
  guides,
  selectedYear,
  selectedMonth,
  selectedDay,
]);

  const totalGuides = useMemo(
    () => filteredGuides.length,
    [filteredGuides]
  );

  return {
    totalGuides,
    calendarData,
    days,
  };
}
