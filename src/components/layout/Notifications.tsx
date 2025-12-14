import { MapPin, X } from "lucide-react";

interface Notification {
  id: string;
  date: string;
  personName: string;
  zone: string;
  priority: "high" | "medium" | "low";
}

const notifications: Notification[] = [
  {
    id: "1",
    date: "March 03 2025 10:12",
    personName: "Ahmad",
    zone: "Zone B",
    priority: "high",
  },
  {
    id: "2",
    date: "March 03 2025 09:45",
    personName: "Sarah",
    zone: "Zone A",
    priority: "medium",
  },
  {
    id: "3",
    date: "March 03 2025 09:30",
    personName: "John",
    zone: "Zone C",
    priority: "low",
  },
  {
    id: "4",
    date: "March 03 2025 08:15",
    personName: "Maria",
    zone: "Zone D",
    priority: "high",
  },
  {
    id: "5",
    date: "March 03 2025 07:50",
    personName: "David",
    zone: "Zone E",
    priority: "medium",
  },
  {
    id: "6",
    date: "March 03 2025 07:20",
    personName: "Emma",
    zone: "Zone F",
    priority: "low",
  },
  {
    id: "7",
    date: "March 03 2025 06:45",
    personName: "Michael",
    zone: "Zone G",
    priority: "high",
  },
];

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Notifications({ isOpen, onClose }: NotificationsProps) {
  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Notifications Panel */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-screen w-80 flex-col rounded-l-2xl bg-white shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-lg font-medium text-[#1E1E1F]">Alerts</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="scrollbar-hide flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="h-25.5 w-74 cursor-pointer rounded-2xl border-2 border-gray-300 bg-white p-3 pb-4 text-[#1E1E1F] transition-all duration-200 hover:border-[#CEF2F1] hover:bg-[#CEF2F1]/40"
            >
              {/* Date */}
              <div className="mb-2 text-sm">{notification.date}</div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                {/* Person Name */}
                <div className="text-base font-bold capitalize">
                  {notification.personName} Entered
                </div>

                {/* Zone and Priority */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <MapPin
                      className="h-4 w-4 text-[#1E1E1F]"
                      fill="none"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm">{notification.zone}</span>
                  </div>
                  <div
                    className={`-mt-1 rounded px-2 py-1 text-xs font-medium text-white capitalize ${
                      notification.priority === "high"
                        ? "bg-[#B42018]"
                        : notification.priority === "medium"
                          ? "bg-[#FF9900]"
                          : "bg-[#00AB7B]"
                    }`}
                  >
                    {notification.priority}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
