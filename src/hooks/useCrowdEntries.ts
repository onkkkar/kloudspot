import { useQuery } from "@tanstack/react-query";
import { getCrowdEntries } from "../api/crowd.api";
import type { EntryExitRequest, EntryExitResponse } from "../types";

export const useCrowdEntries = (request: EntryExitRequest | null) => {
  // UseQuery to fetch crowd entries data
  return useQuery<EntryExitResponse, Error>({
    queryKey: ["crowdEntries", request],
    queryFn: () => {
      // Throw error if request is null
      if (!request) {
        throw new Error("Crowd entries request parameters are required");
      }

      // Fetch crowd entries data
      return getCrowdEntries(request);
    },
    // Only fetch if request is not null
    enabled: request !== null,
  });
};
