import {
  createFileRoute,
  Outlet,
  useLocation,
  redirect,
} from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { TopNavBar } from "../components/layout/TopNavBar";
import { Sidebar } from "../components/layout/Sidebar";
import { PageHeader } from "../components/layout/PageHeader";
import { ApiPerformanceBanner } from "../components/ui/ApiPerformanceBanner";
import { useApiTimings } from "../hooks/useApiTimings";
import { apiTimingTracker } from "../utils/apiTimings";
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
  const apiTimings = useApiTimings();
  const prevPathRef = useRef(location.pathname);

  // Derive bannerKey from pathname (resets banner on route change)
  const bannerKey = location.pathname;

  // Clear timings on route change
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      apiTimingTracker.clear();
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

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
        <div className="scrollbar-hide flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* API Performance Banner - shows server response times */}
      <ApiPerformanceBanner
        key={bannerKey}
        timings={apiTimings}
        show={apiTimings.length >= 1}
      />
    </div>
  );
}
