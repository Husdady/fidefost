// Librarys
import { create } from "zustand";

// Utils
import isValidObject from "utils/isValidObject";

const useProfile = create((set) => ({
  profile: {},

  // Callback for update 'profile' state
  update: (newProfile) => {
    // Validate 'newProfile' param
    if (!isValidObject(newProfile)) return;

    return set((state) => ({
      profile: { ...state.profile, ...newProfile },
    }));
  },
}));

/**
 * Hook for get 'profile' state
 */
export function useGetProfile() {
  const profile = useProfile((state) => state.profile);
  return profile;
}

/**
 * Hook for update 'profile' state
 */
export function useUpdateProfile() {
  const update = useProfile((state) => state.update);
  return update;
}

export default useProfile;
