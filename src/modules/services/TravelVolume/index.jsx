import { useEffect } from "react";
import { useGetServices } from "context/services/useServices";
import useTravelVolume from "./useTravelVolume";


export default function TravelVolume({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
}) {

  const services = useGetServices();
 
  useEffect(() => {
  setSelectedYear("Todos");
  setSelectedMonth("Todos");
  setSelectedDay("Todos");
}, [services.length]);

  const {
  totalGuides,
  totalTrips,
  calendarData,
  days,
} = useTravelVolume({
  selectedYear,
  selectedMonth,
  selectedDay,
});

  const monthsToShow =
    selectedYear === "Todos"
      ? []
      : calendarData.find((y) => y.year === selectedYear)?.months || [];
console.log("days:", days);
  return (
    <section className="travel-volume mt-2">
      <header className="travel-volume-header d-flex align-items-center justify-content-between">
        <h2 className="travel-volume-title mb-0">Volumen de Viajes</h2>
      </header>
      <div className="travel-volume-filters">
        <div className="travel-volume-days">
          {["Todos", ...calendarData.map((y) => y.year)].map((year) => (
            <span
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSelectedMonth("Todos");
                setSelectedDay("Todos");
              }}
              className={selectedYear === year ? "active" : undefined}
            >
              {year}
            </span>
          ))}
        </div>
        <div className="travel-volume-days">
          {["Todos", ...monthsToShow].map((month) => (
            <span
              key={month}
              onClick={() => {
                setSelectedMonth(month);
                setSelectedDay("Todos");
              }}
              className={selectedMonth === month ? "active" : undefined}
            >
              {month}
            </span>
          ))}
        </div>
      </div>
      {selectedMonth !== "Todos" && (
        <div className="travel-volume-days">
          <span
            onClick={() => setSelectedDay("Todos")}
            className={
              selectedDay === "Todos"
                ? "active"
                : undefined
            }
          >
            Todos
          </span>

          {days.map((day) => (
            <span
              key={day.label}
              title={day.comment || ""}
              onClick={() =>
                setSelectedDay(day.label)
              }
              className={
                selectedDay === day.label
                  ? "active"
                  : undefined
              }
            >
              {day.label}
            </span>
          ))}
        </div>
      )}
            
      <div className="travel-volume-cards d-flex align-items-center">
        <article className="travel-volume-card">
          <span>Total Guías</span>
          <strong>{totalGuides}</strong>
        </article>

        <article className="travel-volume-card">
          <span>N° de Viajes</span>
          <strong>{totalTrips}</strong>
        </article>
      </div>
    </section>
  );
}
