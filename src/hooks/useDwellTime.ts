import { useQuery } from "@tanstack/react-query";
import { getDwellTime } from "../api/overview.api";
import type { DwellTimeRequest, DwellTimeResponse } from "../types";

export const useDwellTime = (
  request: DwellTimeRequest | null,
  options?: {
    refetchInterval?: number;
  },
) => {
  return useQuery<DwellTimeResponse, Error>({
    queryKey: ["dwellTime", request],
    queryFn: () => {
      if (!request) {
        throw new Error("Dwell time request parameters are required");
      }
      return getDwellTime(request);
    },
    enabled: request !== null,
    refetchInterval: options?.refetchInterval,
  });
};
