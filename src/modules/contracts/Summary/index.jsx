// Components
import SummaryCard from "components/features/SummaryCard";
// Constants
//import { useSummaryItems } from "./constants";
import useSummaryItems from "./constants";


export default function ContractsSummary() {
  
  const SUMMARY_ITEMS = useSummaryItems();
  return (
    <section className="contracts-summary">
      <div className="contracts-summary__grid">
        {SUMMARY_ITEMS.map((item) => (
          <SummaryCard
            key={item.id}
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