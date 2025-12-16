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
  return useQuery<FootfallResponse, Error>({
    queryKey: ["footfall", request],
    queryFn: () => {
      if (!request) {
        throw new Error("Footfall request parameters are required");
      }
      return getFootfall(request);
    },
    enabled: request !== null,
    refetchInterval: options?.refetchInterval,
  });
};
