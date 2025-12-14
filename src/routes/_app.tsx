import {
  createFileRoute,
  Outlet,
  useLocation,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import { TopNavBar } from "../components/layout/TopNavBar";
import { Sidebar } from "../components/layout/Sidebar";
import { PageHeader } from "../components/layout/PageHeader";
import { isAuthenticated } from "../api/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
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

      <main className="flex flex-1 flex-col bg-gray-50">
        <TopNavBar />

        {/* Page Header */}
        <PageHeader title={getPageTitle()} />

        {/* Content Area */}
        <div className="scrollbar-hide flex-1 overflow-y-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
