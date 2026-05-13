export default function UnitsTable() {

  const units = [
    {
      placa: "ABC-982",
      tipo: "TRACTOR",
      mtc: "104293881",
      empresa: "TransLog S.A.",
      revision: "VENCE 12/2026",
      soat: "SOAT OK",
      poliza: "Mapfre #993822",
      circulacion: "TC-8839210-B"
    }
  ];

  return (
    <div className="units-table-container">

      {/* HEADER */}
      <div className="units-table-header">

        <div>
          <h3>Listado de Unidades</h3>
        </div>

        <div className="units-table-filters">

          <input type="date" />

          <input type="date" />

          <button className="export-btn">
            Exportar Data
          </button>

        </div>

      </div>

      {/* TABLE */}
      <table className="units-table">

        <thead>
          <tr>
            <th>UNIDAD / PLACA</th>
            <th>MTC / PROPIEDAD</th>
            <th>REV. TÉCNICA</th>
            <th>SOAT / PÓLIZA</th>
            <th>CIRCULACIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>

          {units.map((unit, index) => (
            <tr key={index}>

              <td>
                <div className="unit-info">

                  <div className="unit-icon">
                    🚚
                  </div>

                  <div>
                    <strong>{unit.placa}</strong>

                    <p>{unit.tipo}</p>
                  </div>

                </div>
              </td>

              <td>
                <strong>
                  MTC: {unit.mtc}
                </strong>

                <p>
                  TIT: {unit.empresa}
                </p>
              </td>

              <td>
                <span className="badge-success">
                  {unit.revision}
                </span>
              </td>

              <td>
                <strong className="soat-ok">
                  ● {unit.soat}
                </strong>

                <p>{unit.poliza}</p>
              </td>

              <td>
                {unit.circulacion}
              </td>

              <td>
                ⋮
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}