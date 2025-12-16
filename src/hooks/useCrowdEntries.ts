import { useQuery } from "@tanstack/react-query";
import { getCrowdEntries } from "../api/crowd.api";
import type { EntryExitRequest, EntryExitResponse } from "../types";

export const useCrowdEntries = (request: EntryExitRequest | null) => {
  return useQuery<EntryExitResponse, Error>({
    queryKey: ["crowdEntries", request],
    queryFn: () => {
      if (!request) {
        throw new Error("Crowd entries request parameters are required");
      }
      return getCrowdEntries(request);
    },
    enabled: request !== null,
  });
};
