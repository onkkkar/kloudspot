import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../queryClient";
import { SocketAlertsProvider } from "../contexts/SocketAlertsContext";

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <SocketAlertsProvider>
      <Outlet />

      {import.meta.env.VITE_SHOW_DEVTOOLS && (
        <>
          {/* <TanStackRouterDevtools /> */}
          <ReactQueryDevtools initialIsOpen={false} />
        </>
      )}
    </SocketAlertsProvider>
  </QueryClientProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
});
