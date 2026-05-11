// Components
import DownloadIcon from "components/icons/download-icon";
import AddButton from "components/features/PageHeader/AddButton";

// Hooks
import useExportButton from "./useExportButton";

export default function ExportButton() {
  const { handleExport, isExportingServices } = useExportButton();

  return (
    <AddButton
      title="EXPORTAR TODO"
      icon={<DownloadIcon />}
      className="btn-export"
      isLoading={isExportingServices}
      onClick={handleExport}
    />
  );
}
