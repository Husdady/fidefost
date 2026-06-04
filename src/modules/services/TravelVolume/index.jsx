import { useState } from "react";
import useTravelVolume from "./useTravelVolume";


export default function TravelVolume() {
  const {
  totalGuides,
  tripsPerDay,
  years,
  months,
} = useTravelVolume();

const [selectedYear, setSelectedYear] =
  useState("Todos");

const [selectedMonth, setSelectedMonth] =
  useState("Todos");

  return (
    <section className="travel-volume mt-2">
      <header className="travel-volume-header d-flex align-items-center justify-content-between">
        <h2 className="travel-volume-title mb-0">Volumen de Viajes</h2>
      </header>

      <div className="travel-volume-days d-flex align-items-center justify-content-between">
        {["Todos", ...years].map((year) => (
          <span
            key={year}
            onClick={() => setSelectedYear(year)}
            className={
              selectedYear === year
                ? "active"
                : undefined
            }
          >
            {year}
          </span>
        ))}
      </div>

      <div className="travel-volume-days d-flex align-items-center justify-content-between">
        {["Todos", ...months].map((month) => (
          <span
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={
              selectedMonth === month
                ? "active"
                : undefined
            }
          >
            {month}
          </span>
        ))}
      </div>

      <div className="travel-volume-cards d-flex align-items-center">
        <article className="travel-volume-card">
          <span>Total Guías</span>
          <strong>{totalGuides}</strong>
        </article>

        <article className="travel-volume-card">
          <span>Viajes/Día</span>
          <strong>{tripsPerDay}</strong>
        </article>
      </div>
    </section>
  );
}
