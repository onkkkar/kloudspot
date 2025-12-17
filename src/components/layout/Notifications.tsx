import { MapPin, X } from "lucide-react";
import { useSocketAlerts } from "../../hooks/useSocketAlerts";
import type { AlertEventPayload } from "../../types/socket.types";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Format timestamp to readable date string
function formatAlertDate(ts: number): string {
  const date = new Date(ts);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Convert alert direction to display text
function getActionText(
  direction: "entry" | "exit" | "zone-exit" | "zone-entry",
): string {
  if (direction === "entry" || direction === "zone-entry") return "Entered";
  if (direction === "exit" || direction === "zone-exit") return "Exited";
  return "Unknown";
}

export function Notifications({ isOpen, onClose }: NotificationsProps) {
  const { alerts, isConnected } = useSocketAlerts({ maxAlerts: 50 });

  // Debug: Log alerts when they change
  // useEffect(() => {
  //   console.log("Notifications: Current alerts count", alerts.length);
  //   console.log("Notifications: Alerts", alerts);
  //   console.log("Notifications: Panel isOpen", isOpen);
  // }, [alerts, isOpen]);

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
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-[#1E1E1F]">Alerts</span>
            {!isConnected && (
              <span className="text-xs text-gray-500">(Disconnected)</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="scrollbar-hide flex flex-col gap-3 overflow-x-hidden overflow-y-auto p-3">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <p className="text-sm">No alerts yet</p>
              {!isConnected && (
                <p className="mt-2 text-xs text-gray-400">
                  Waiting for connection...
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Debug: Show alert count */}
              <div className="text-xs text-gray-400">
                Showing {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
              </div>
              {alerts.map((alert: AlertEventPayload, index: number) => {
                // console.log("Rendering alert:", alert, "Index:", index);
                return (
                  <div
                    key={`${alert.eventId}-${alert.ts}-${index}`}
                    className="h-25.5 w-74 cursor-pointer rounded-2xl border-2 border-gray-300 bg-white p-3 pb-4 text-[#1E1E1F] transition-all duration-200 hover:border-[#CEF2F1] hover:bg-[#CEF2F1]/40"
                  >
                    {/* Date */}
                    <div className="mb-2 text-sm">
                      {formatAlertDate(alert.ts)}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1">
                      {/* Person Name and Action */}
                      <div className="truncate text-base font-bold">
                        {alert.personName ? alert.personName : "Unknown Person"}{" "}
                        {getActionText(alert.direction)}
                      </div>

                      {/* Zone and Priority */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-1">
                          <MapPin
                            className="h-4 w-4 shrink-0 text-[#1E1E1F]"
                            fill="none"
                            strokeWidth={1.5}
                          />
                          <span className="truncate text-sm">
                            {alert.zoneName ||
                              alert.placeName ||
                              alert.zoneId ||
                              "Unknown Zone"}
                          </span>
                        </div>
                        <div
                          className={`shrink-0 rounded px-2 py-1 text-xs font-medium text-white capitalize ${
                            alert.severity === "high"
                              ? "bg-[#B42018]"
                              : alert.severity === "medium"
                                ? "bg-[#FF9900]"
                                : "bg-[#00AB7B]"
                          }`}
                        >
                          {alert.severity}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
