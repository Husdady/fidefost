// Hooks
import { useQuery } from "react-query";

// Utils
import getCoursesProgress from "./getCoursesProgress";

const GET_COURSES_PROGRESS_KEY = "get-courses-progress";

/**
 * Hook for get courses progress
 * @param {object} params Params
 */
export default function useGetCoursesProgress(params) {
  const query = useQuery({
    onError: params?.onError,
    onSuccess: params?.onSuccess,
    queryFn: getCoursesProgress,
    queryKey: GET_COURSES_PROGRESS_KEY,
    refetchOnWindowFocus: false,
  });

  return query;
}
