// Librarys
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Utils
import isValidArray from "utils/isValidArray";

const useServices = create(
  persist(
    (set) => ({
      services: [],

      // Callback for add service
      add: (newServices) => {
        // Validate 'newServices' param
        if (!isValidArray(newServices)) return;

        return set((state) => ({
          services: [...state.services, ...newServices],
        }));
      },

      // Callback for delete service
      delete: (serviceId) => {
        return set((state) => ({
          services: createValidArray(state.services).filter(
            (item) => item?._id !== serviceId
          ),
        }));
      },
    }),
    {
      name: "services-storage", // unique key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        services: state.services,
      }),
    }
  )
);

/**
 * Hook for get 'services' state
 */
export function useGetServices() {
  const services = useServices((state) => state.services);
  return services;
}

/**
 * Hook for add services
 */
export function useAddServices() {
  const add = useServices((state) => state.add);
  return add;
}

/**
 * Hook for delete service
 */
export function useDeleteService() {
  const handleDelete = useServices((state) => state.delete);
  return handleDelete;
}

export default useServices;
