// Components
import SummaryCard from "components/features/SummaryCard";

// Constants
import { SUMMARY_ITEMS } from "./constants";

export default function UnitsSummary() {
  return (
    <section className="units-summary">
      <div className="units-summary__grid">
        {SUMMARY_ITEMS.map((item) => (
          <SummaryCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            value={item.value}
            accent={item.accent}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}