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
  return useQuery<OccupancyResponse, Error>({
    queryKey: ["occupancy", request],
    queryFn: () => {
      if (!request) {
        throw new Error("Occupancy request parameters are required");
      }
      return getOccupancy(request);
    },
    enabled: request !== null,
    refetchInterval: options?.refetchInterval,
  });
};
