// Hooks
import { useMemo, useState, useCallback } from "react";
import { useGetClients } from "context/clients/useClients";

import useEditOperator from "./hooks/useEditOperator";
import useDeleteOperator from "./hooks/useDeleteOperator";
import useDownloadDocuments from "./hooks/useDownloadDocuments";
import useToggleOperatorStatus from "./hooks/useToggleOperatorStatus";

/**
 * Hook for implements logic of OperatorList component
 */
export default function useOperatorList() {
  const operators = useGetClients();
  const [search, setSearch] = useState("");
  const editOperatorData = useEditOperator();
  const deleteOperatorData = useDeleteOperator();
  const downloadData = useDownloadDocuments(editOperatorData);
  const toggleOperatorStatus = useToggleOperatorStatus();

  const handleSearch = useCallback((event) => {
    setSearch(event?.target?.value || "");
  }, []);

  const filteredOperators = useMemo(() => {
    const validOperators = Array.isArray(operators) ? operators : [];
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return validOperators;
    }

    return validOperators.filter((operator) => {
      const operatorName = operator?.operatorName?.toLowerCase?.() || "";
      const ruc = operator?.ruc?.toLowerCase?.() || "";

      return (
        operatorName.includes(normalizedSearch) ||
        ruc.includes(normalizedSearch)
      );
    });
  }, [operators, search]);

  const formatCreatedAt = useCallback((date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getStatusLabel = useCallback((status) => {
    return status === "danger" ? "En riesgo" : "Saludable";
  }, []);

  return {
    ...downloadData,
    ...editOperatorData,
    ...deleteOperatorData,

    search,
    filteredOperators,
    handleSearch,
    formatCreatedAt,
    getStatusLabel,
    toggleOperatorStatus,
  };
}
