// Hooks
import { useMemo } from "react";
import { useGetClients } from "context/clients/useClients";

// Constants
import { SUMMARY_ITEMS } from "./constants";

/**
 * Hook for implements logic of Summary component
 */
export default function useSummary() {
  const clients = useGetClients();

  // Define summary items
  const summaryItems = useMemo(() => {
    const summaryCopy = [...SUMMARY_ITEMS];

    summaryCopy[0].value = clients?.length;

    summaryCopy[1].value = clients.filter(
      (item) => item?.status === "fine"
    )?.length;

    summaryCopy[2].value = clients.filter(
      (item) => item?.status === "danger"
    )?.length;

    return summaryCopy;
  }, [clients]);

  return {
    summaryItems: summaryItems,
  };
}
