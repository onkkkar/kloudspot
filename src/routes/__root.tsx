import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../queryClient";

const showDevtools = import.meta.env.VITE_SHOW_DEVTOOLS;

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <Outlet />

    {showDevtools && (
      <>
        {/* <TanStackRouterDevtools /> */}
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    )}
  </QueryClientProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
});
