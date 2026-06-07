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

  console.log("ALL GUIDES", guides);

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
    console.log(
  result.filter((g) => g.comment)
);

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
          result.push(day);
        } else {
          result.push(`${day}-${nextDay}`);
        }

        usedDays.add(day);
        usedDays.add(nextDay);

        return;
      }
    }

    result.push(day);
    usedDays.add(day);
  });

  return result.sort((a, b) => {
    const getStartDay = (value) => {
      if (typeof value === "string") {
        return Number(value.split("-")[0]);
      }

      return value;
    };

    return getStartDay(a) - getStartDay(b);
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

  const totalTrips = useMemo(() => {
  let trips = 0;

  filteredGuides.forEach((guide, index) => {
    const groupedComments = [
      "SE CARGO EN UN SOLO VIAJE",
      "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE",
    ];

    const grouped =
      groupedComments.includes(
        guide.comment
      );

    if (!grouped) {
      trips += 1;
      return;
    }

    const previous =
      filteredGuides[index - 1];

    const sameComment =
      previous?.comment ===
      guide.comment;

    if (!sameComment) {
      trips += 1;
    }
  });

  return trips;
}, [filteredGuides]);

 

  return {
    totalGuides,
    totalTrips,
    calendarData,
    days,
  };
}
