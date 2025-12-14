import { useState } from "react";
import { Bell, MapPin, ChevronDown } from "lucide-react";
import { Notifications } from "./Notifications";

export function TopNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <nav className="mb-6 flex h-16 w-full items-center justify-between bg-white shadow-sm">
        {/* Left: Crowd Solution with Dropdown */}
        <div className="flex items-center gap-2 p-3">
          <span className="text-lg text-[18px] font-medium text-[#1E1E1F]">
            Crowd Solutions
          </span>
          <span className="mx-3 text-sm text-[#1E1E1F]">|</span>
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

          <button className="bg-primary-green flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-colors hover:opacity-80">
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
        </div>
      </nav>
    </>
  );
}
