// Hooks
import { useQuery } from "react-query";

// Utils
import getProfile from "./getProfile";
import isValidString from "utils/isValidString";

const GET_PROFILE_KEY = "get-profile";

/**
 * Hook for get Wix user profile
 * @param {object} params Params
 */
export default function useGetProfile(params) {
  return useQuery({
    queryFn: getProfile,
    onError: params?.onError,
    refetchOnWindowFocus: false,
    onSuccess: params?.onSuccess,
    enabled: isValidString(params?.token),
    queryKey: [params?.token, GET_PROFILE_KEY],
  });
}
