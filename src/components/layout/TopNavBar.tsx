import { useState, useRef, useEffect } from "react";
import { Bell, MapPin, ChevronDown, User, LogOut } from "lucide-react";
import { PiLineVertical } from "react-icons/pi";
import { Notifications } from "./Notifications";
import { useNavigate } from "@tanstack/react-router";
import { logout } from "../../api/auth";

export function TopNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <nav className="mb-6 flex h-16 w-full items-center justify-between bg-white shadow-sm">
        {/* Left: Crowd Solution with Dropdown */}
        <div className="flex items-center gap-3 p-3">
          <span className="text-lg text-[18px] font-medium text-[#1E1E1F]">
            Crowd Solutions
          </span>
          <PiLineVertical className="h-5 w-5 text-[#1E1E1F]" />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center gap-1.5 rounded-md border border-black/20 px-2 py-1 transition-colors hover:bg-gray-100"
            >
              <MapPin
                className="fill h-4 w-4 text-[#1E1E1F]"
                strokeWidth={1.5}
              />
              <span className="text-base text-[16px] font-normal text-[#1E1E1F]">
                Avenue Mall
              </span>
              <ChevronDown
                className="h-4 w-4 text-[#1E1E1F]"
                strokeWidth={1.5}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 w-full min-w-full rounded-md border border-black/20 bg-white p-1 shadow-lg">
                <div className="cursor-pointer rounded px-2 py-1 text-center text-sm font-normal text-[#1E1E1F] hover:bg-gray-100">
                  Avenue Mall
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Bell and Profile Icons */}
        <div className="relative flex items-center gap-4 p-3">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
          >
            <Bell className="h-7 w-7" strokeWidth={1.5} />
          </button>

          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="bg-primary-green flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-colors hover:opacity-80"
              aria-label="Profile menu"
            >
              <img
                src="/images/profile.png"
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute top-10 right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate({ to: "/" });
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: "/crowd-entries" });
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    <span>Crowd Entries</span>
                  </button>
                  <div className="my-1 border-t border-gray-200" />
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
