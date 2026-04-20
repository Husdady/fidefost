// Librarys
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Utils
import isValidObject from "utils/isValidObject";
import createValidArray from "utils/createValidArray";
import createValidObject from "utils/createValidObject";

const useClients = create(
  persist(
    (set) => ({
      clients: [],

      // Callback for add client
      add: (newClient) => {
        // Validate 'newClient' param
        if (!isValidObject(newClient)) return;

        return set((state) => ({
          clients: [...state.clients, newClient],
        }));
      },

      // Callback for update client
      update: (clientId, clientData) => {
        return set((state) => {
          // Get clients
          const clients = createValidArray(state.clients);

          // Get index of client
          const index = clients.findIndex((item) => item?._id === clientId);

          // Validate index
          if (index >= 0) {
            clients[index] = {
              ...clients[index],
              ...createValidObject(clientData),
            };
          }

          return { clients };
        });
      },

      // Callback for delete client
      delete: (clientId) => {
        return set((state) => ({
          clients: createValidArray(state.clients).filter(
            (item) => item?._id !== clientId
          ),
        }));
      },
    }),
    {
      name: "clients-storage", // unique key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        clients: state.clients,
      }),
    }
  )
);

/**
 * Hook for get 'clients' state
 */
export function useGetClients() {
  const clients = useClients((state) => state.clients);
  return clients;
}

/**
 * Hook for add client
 */
export function useAddClient() {
  const add = useClients((state) => state.add);
  return add;
}

/**
 * Hook for update client state
 */
export function useUpdateClient() {
  const update = useClients((state) => state.update);
  return update;
}

/**
 * Hook for delete clients
 */
export function useDeleteClient() {
  const handleDelete = useClients((state) => state.delete);
  return handleDelete;
}

export default useClients;
