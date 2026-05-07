const days = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export default function TravelVolume() {
  return (
    <section className="travel-volume mt-2">
      <header className="travel-volume-header d-flex align-items-center justify-content-between">
        <h2 className="travel-volume-title mb-0">Volumen de Viajes</h2>

        <span className="travel-volume-percentage">+12.5%</span>
      </header>

      <div className="travel-volume-days d-flex align-items-center justify-content-between">
        {days.map((day) => (
          <span key={day} className={day === "Ju" ? "active" : undefined}>
            {day}
          </span>
        ))}
      </div>

      <div className="travel-volume-cards d-flex align-items-center">
        <article className="travel-volume-card">
          <span>Total Guías</span>
          <strong>1,482</strong>
        </article>

        <article className="travel-volume-card">
          <span>Viajes/Día</span>
          <strong>48.5</strong>
        </article>
      </div>
    </section>
  );
}
