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
  return useQuery<DemographicsResponse, Error>({
    queryKey: ["demographics", request],
    queryFn: () => {
      if (!request) {
        throw new Error("Demographics request parameters are required");
      }
      return getDemographics(request);
    },
    enabled: request !== null,
    refetchInterval: options?.refetchInterval,
  });
};
