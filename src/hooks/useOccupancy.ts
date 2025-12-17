import { useQuery } from "@tanstack/react-query";
import { getOccupancy } from "../api/overview.api";
import type { OccupancyRequest, OccupancyResponse } from "../types";

// Hook to fetch occupancy data
export const useOccupancy = (
  request: OccupancyRequest | null,
  options?: {
    refetchInterval?: number;
  },
) => {
  // UseQuery to fetch occupancy data
  return useQuery<OccupancyResponse, Error>({
    queryKey: ["occupancy", request],
    queryFn: () => {
      // Throw error if request is null
      if (!request) {
        throw new Error("Occupancy request parameters are required");
      }
      // Fetch occupancy data
      return getOccupancy(request);
    },
    // Only fetch if request is not null
    enabled: request !== null,
    // Refetch interval if provided
    refetchInterval: options?.refetchInterval,
  });
};
