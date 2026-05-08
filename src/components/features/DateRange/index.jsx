export default function DateRange({
  desde,
  hasta,
  setDesde,
  setHasta,
}) {

  return (
    <div className="rango">

      <input
        type="date"
        value={desde}
        onChange={(e) =>
          setDesde(e.target.value)
        }
      />

      <input
        type="date"
        value={hasta}
        onChange={(e) =>
          setHasta(e.target.value)
        }
      />

    </div>
  );
}