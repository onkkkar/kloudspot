import { useQuery } from "@tanstack/react-query";
import { getDwellTime } from "../api/overview.api";
import type { DwellTimeRequest, DwellTimeResponse } from "../types";

// Hook to fetch dwell time data
export const useDwellTime = (
  request: DwellTimeRequest | null,
  options?: {
    refetchInterval?: number;
  },
) => {
  // UseQuery to fetch dwell time data
  return useQuery<DwellTimeResponse, Error>({
    queryKey: ["dwellTime", request],
    queryFn: () => {
      // Throw error if request is null
      if (!request) {
        throw new Error("Dwell time request parameters are required");
      }
      // Fetch dwell time data
      return getDwellTime(request);
    },
    // Only fetch if request is not null
    enabled: request !== null,
    // Refetch interval if provided
    refetchInterval: options?.refetchInterval,
  });
};
