// Crowd Entries API endpoints
import Axios from "./interceptor";
import type { EntryExitRequest, EntryExitResponse } from "../types";

export const getCrowdEntries = async (
  request: EntryExitRequest,
): Promise<EntryExitResponse> => {
  try {
    const response = await Axios.post<EntryExitResponse>(
      "analytics/entry-exit",
      request,
    );

    // console.log("Crowd Entries response:", response.data);
    return response.data;
  } catch (err: unknown) {
    console.error("Crowd Entries error:", err);
    throw err;
  }
};
