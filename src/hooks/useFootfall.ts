import { useQuery } from "@tanstack/react-query";
import { getFootfall } from "../api/overview.api";
import type { FootfallRequest, FootfallResponse } from "../types";

// Hook to fetch footfall data
export const useFootfall = (
  request: FootfallRequest | null,
  options?: {
    refetchInterval?: number;
  },
) => {
  // UseQuery to fetch footfall data
  return useQuery<FootfallResponse, Error>({
    queryKey: ["footfall", request],
    queryFn: () => {
      // Throw error if request is null
      if (!request) {
        throw new Error("Footfall request parameters are required");
      }
      // Fetch footfall data
      return getFootfall(request);
    },
    // Only fetch if request is not null
    enabled: request !== null,
    // Refetch interval if provided
    refetchInterval: options?.refetchInterval,
  });
};
