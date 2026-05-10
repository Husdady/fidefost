export default function ContractsGPSItems({
  items = [],
}) {
  return (
    <div className="contracts-gps__list">

      {items.map((item, index) => (
        <div
          key={index}
          className="contracts-gps-item"
        >
          <div className="contracts-gps-item__header">
            <span className="contracts-gps-item__id">
              ID: {item.id}
            </span>

            <span className="contracts-gps-item__status">
              ● ONLINE
            </span>
          </div>

          <div className="contracts-gps-item__body">

            <div className="contracts-gps-item__column">
              <span className="contracts-gps-item__label">
                INICIO CONTRATO
              </span>

              <span className="contracts-gps-item__date">
                {item.installationDate}
              </span>
            </div>

            <div className="contracts-gps-item__column">
              <span className="contracts-gps-item__label">
                FIN CONTRATO
              </span>

              <span className="contracts-gps-item__date">
                {item.endDate}
              </span>
            </div>

          </div>
        </div>
      ))}

    </div>
  );
}