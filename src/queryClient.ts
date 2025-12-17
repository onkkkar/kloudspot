import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // For 5 minutes data is fresh
      staleTime: 1000 * 60 * 5,

      // No refetch on window focus
      refetchOnWindowFocus: false,

      // max 1 retry on failure
      retry: 1,
    },
  },
});
