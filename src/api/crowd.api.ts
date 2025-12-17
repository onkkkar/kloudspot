// Crowd Entries API endpoints
import Axios from "./interceptor";
import type { EntryExitRequest, EntryExitResponse } from "../types";
import { apiTimingTracker } from "../utils/apiTimings";

export const getCrowdEntries = async (
  request: EntryExitRequest,
): Promise<EntryExitResponse> => {
  const startTime = performance.now();
  const response = await Axios.post<EntryExitResponse>(
    "analytics/entry-exit",
    request,
  );
  const duration = performance.now() - startTime;
  apiTimingTracker.record("Crowd Entries", duration);
  return response.data;
};
