// Librarys
import { create } from "zustand";

// Utils
import isValidObject from "utils/isValidObject";

const useWixData = create((set) => ({
  wix: {},

  // Callback for update 'wix-profile' state
  update: (newWix) => {
    // Validate 'newWix' param
    if (!isValidObject(newWix)) return;

    return set((state) => ({
      wix: { ...state.wix, ...newWix },
    }));
  },
}));

/**
 * Hook for get 'wix-data' state
 */
export function useGetWixData() {
  const wix = useWixData((state) => state.wix);
  return wix;
}

/**
 * Hook for update 'wix-data' state
 */
export function useUpdateWixData() {
  const update = useWixData((state) => state.update);
  return update;
}

export default useWixData;
