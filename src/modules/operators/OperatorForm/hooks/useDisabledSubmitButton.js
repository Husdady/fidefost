// Hooks
import { useMemo } from "react";
import { useGetClients } from "context/clients/useClients";

// Utils
import isValidObject from "utils/isValidObject";
import createValidArray from "utils/createValidArray";
import { areObjectsEqual } from "utils/areEquals";

/**
 * Callback for get fields
 */
function getFields(data) {
  return {
    _id: data?._id,
    ruc: data?.ruc,
    operatorName: data?.operatorName,
    files: createValidArray(data?.files).map((item) => ({
      _id: item?._id,
      name: item?.name,
      size: item?.size,
      type: item?.type,
    })),
  };
}

/**
 * Hook for check if submit button is disabled
 * @param {object} params Params
 */
export default function useDisabledSubmitButton({ watch, errors }) {
  const clients = useGetClients();

  const formValues = watch();

  // Get operator id
  const operatorId = formValues?._id;

  // Check if the submit button is disabled
  const isDisabledSubmitButton = useMemo(() => {
    const clientFound = clients.find((item) => item?._id === operatorId);
    const data2 = getFields(formValues);
    const data1 = getFields(clientFound);

    return isValidObject(errors) || areObjectsEqual(data1, data2);
  }, [errors, clients, operatorId, formValues]);

  return isDisabledSubmitButton;
}
