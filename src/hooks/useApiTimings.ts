import { useState, useEffect } from "react";
import { apiTimingTracker, type ApiTiming } from "../utils/apiTimings";

// Use Api Timings Hook
export function useApiTimings() {
  // Timings state
  const [timings, setTimings] = useState<ApiTiming[]>(() =>
    apiTimingTracker.getRecent(),
  );

  // Subscribe to timing updates
  useEffect(() => {
    const unsubscribe = apiTimingTracker.subscribe((newTimings) => {
      setTimings(newTimings);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return timings;
}
