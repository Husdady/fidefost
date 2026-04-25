// Components
import SummaryGPS from "components/features/SummaryGPS";

// Constants
import { CONTRACTSGPS_ITEMS } from "./constants";

export default function ContractsGPSItems() {
  return (
      <div className="contracts-gps-items__grid">
        {CONTRACTSGPS_ITEMS.map((item) => (
          <SummaryGPS
            key={item.id}
            id={item.cod}
            icon={item.iconstatus}
            title={item.facility}
            value={item.endofcontract}
            accent={item.accent}
          />
        ))}
      </div>
  );
}