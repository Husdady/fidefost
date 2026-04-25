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
            icon={item.icon}
            status={item.status}
            facility={item.facility}
            endcontract={item.endcontract}
            accent={item.accent}
          />
        ))}
      </div>
  );
}