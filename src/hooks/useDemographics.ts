import { useQuery } from "@tanstack/react-query";
import { getDemographics } from "../api/overview.api";
import type { DemographicsRequest, DemographicsResponse } from "../types";

// Hook to fetch demographics data
export const useDemographics = (
  request: DemographicsRequest | null,
  options?: {
    refetchInterval?: number;
  },
) => {
  // UseQuery to fetch demographics data
  return useQuery<DemographicsResponse, Error>({
    queryKey: ["demographics", request],
    queryFn: () => {
      // Throw error if request is null
      if (!request) {
        throw new Error("Demographics request parameters are required");
      }
      // Fetch demographics data
      return getDemographics(request);
    },
    // Only fetch if request is not null
    enabled: request !== null,

    // Refetch interval if provided
    refetchInterval: options?.refetchInterval,
  });
};
