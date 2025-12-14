import { Link, useLocation } from "@tanstack/react-router";
import { ExternalLink, Menu, Power } from "lucide-react";
import { VscHome } from "react-icons/vsc";
import { logout } from "../../api/auth";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-54 translate-x-0" : "w-0 -translate-x-full"
        } from-primary-black via-primary-green to-primary-black flex h-screen flex-col overflow-hidden bg-linear-to-b transition-all duration-300 ease-in-out`}
      >
        {/* Header with Logo and Hamburger */}
        <div className="flex h-16 items-center justify-between border-b border-black/80 px-4">
          {/* Logo and Text */}
          <div className="flex items-center gap-1 text-xl font-semibold text-white">
            <img src="/images/logo.png" alt="logo" className="h-5 w-5" />
            <div>kloudspot</div>
          </div>
          {/* Hamburger Icon */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:opacity-80"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4 pt-3">
          <Link
            to="/"
            className={`relative flex h-12.5 items-center gap-3 rounded-md px-3 text-base font-normal tracking-[0.27px] text-white capitalize transition-colors ${
              isActive("/") ? "bg-white/30" : "hover:bg-white/30"
            }`}
          >
            {isActive("/") && (
              <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
            )}
            <VscHome className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link
            to="/crowd-entries"
            className={`relative flex h-12.5 items-center gap-3 rounded-md px-3 text-base font-normal tracking-[0.27px] text-white capitalize transition-colors ${
              isActive("/crowd-entries") ? "bg-white/30" : "hover:bg-white/30"
            }`}
          >
            {isActive("/crowd-entries") && (
              <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
            )}
            <ExternalLink className="h-5 w-5" strokeWidth={1.5} />
            <span>Crowd Entries</span>
          </Link>
        </nav>

        {/* Logout Button - Bottom Left */}
        <div className="mt-auto h-12.5 w-54 px-4 pb-4">
          <button
            onClick={logout}
            className="flex items-center gap-4 text-left text-base font-medium text-white transition-colors hover:opacity-80"
            aria-label="Logout"
          >
            <Power className="h-5 w-5" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Floating Hamburger Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-primary-black hover:bg-primary-green fixed top-4 left-4 z-50 rounded-md p-2 text-white shadow-lg transition-all"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" strokeWidth={2} />
        </button>
      )}
    </>
  );
}
