import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { TopNavBar } from "../components/layout/TopNavBar";
import { Sidebar } from "../components/layout/Sidebar";
import { PageHeader } from "../components/layout/PageHeader";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Determine page title based on route
  const getPageTitle = () => {
    const pathname = location.pathname;
    if (pathname === "/crowd-entries" || pathname.includes("crowd-entries")) {
      return "Overview";
    }
    return "Overview";
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex flex-1 flex-col">
        <TopNavBar />

        {/* Page Header */}
        <div className="px-4">
          <PageHeader title={getPageTitle()} />
        </div>

        {/* Content Area */}
        <div className="scrollbar-hide flex-1 overflow-y-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
