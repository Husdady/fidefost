// Hooks
import { useMemo } from "react";
import { useGetServices } from "context/services/useServices";

// Utils
import createValidArray from "utils/createValidArray";
import normalizeDate from "../utils/normalizeDate";
import calculateTrips from "../utils/calculateTrips";

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

    let matchDay = false;

    if (selectedDay === "Todos") {
      matchDay = true;
    } else if (
      typeof selectedDay === "string" &&
      selectedDay.includes("-")
    ) {
      const [start, end] =
        selectedDay.split("-").map(Number);

      matchDay =
        date?.getDate() === start ||
        date?.getDate() === end;
    } else {
      matchDay =
        date?.getDate() === selectedDay;
    }

    return (
      matchYear &&
      matchMonth &&
      matchDay
    );
    });

  return result;
    
  }, [guides, selectedYear, selectedMonth, selectedDay,]);

const days = useMemo(() => {
  const result = [];
  const usedDays = new Set();

  const filtered = guides.filter((g) => {
    const matchYear =
      selectedYear === "Todos" ||
      g.year === selectedYear;

    const matchMonth =
      selectedMonth === "Todos" ||
      g.month === selectedMonth;

    return matchYear && matchMonth;
  });

  filtered.forEach((g, index) => {
    const d = normalizeDate(g.date);

    if (!d) return;

    const day = d.getDate();

    if (usedDays.has(day)) {
      const existing = result.find(
        (item) => item.label === day
      );

      if (existing && g.comment) {
        const comments = String(
          existing.comment || ""
        )
          .split(", ")
          .filter(Boolean);

        const currentComment =
          String(g.comment);

        if (!comments.includes(currentComment)) {
          comments.push(currentComment);
        }

        existing.comment =
          comments.join(", ");
      }

      return;
    }

    if (
      g.comment ===
      "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE"
    ) {
      const next = filtered[index + 1];

      if (
        next?.comment ===
        "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE"
      ) {
        const nextDay = normalizeDate(
          next.date
        )?.getDate();

        if (day === nextDay) {
          result.push({
            label: day,
            comment: g.comment,
          });
        } else {
          result.push({
            label: `${day}-${nextDay}`,
            comment: g.comment,
          });
        }

        usedDays.add(day);
        usedDays.add(nextDay);

        return;
      }
    }

    result.push({
      label: day,
      comment: g.comment
        ? String(g.comment)
        : null,
    });
    usedDays.add(day);
  });

  return result.sort((a, b) => {
  const getStartDay = (item) => {
    const label = item.label;

    if (
      typeof label === "string" &&
      label.includes("-")
    ) {
      return Number(
        label.split("-")[0]
      );
    }

    return Number(label);
  };

  return (
    getStartDay(a) -
    getStartDay(b)
  );
});
}, [
  guides,
  selectedYear,
  selectedMonth,
]);

  const totalGuides = useMemo(
    () => filteredGuides.length,
    [filteredGuides]
  );

  const totalTrips = useMemo(
  () => calculateTrips(filteredGuides),
  [filteredGuides]
);
 

  return {
    totalGuides,
    totalTrips,
    calendarData,
    days,
  };
}
