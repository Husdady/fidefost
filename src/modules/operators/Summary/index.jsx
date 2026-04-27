// Components
import SummaryCard from "components/features/SummaryCard";

// Hooks
import useSummary from "./useSummary";

export default function OperatorsSummary() {
  const { summaryItems } = useSummary();

  return (
    <section className="operators-summary">
      <div className="operators-summary__grid">
        {summaryItems.map((item) => (
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
