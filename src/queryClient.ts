import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // For 5 minutes data is fresh
      refetchOnWindowFocus: false, // No refetch on window focus
      retry: 1, // max 1 retry on failure
    },
  },
});
