import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCrowdEntries } from "../../hooks/useCrowdEntries";
import { LoadingSpinner } from "../ui";

export function CrowdEntriesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const siteId = "b0fa4e2a-2159-42e7-b97b-2a9d481158f6";

  // Calculate today's UTC time range
  const timeRange = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endOfToday = new Date();

    return {
      fromUtc: startOfToday.getTime(),
      toUtc: endOfToday.getTime(),
    };
  }, []);

  // Fetch crowd entries data
  const {
    data: entryExitData,
    isLoading,
    error,
  } = useCrowdEntries({
    siteId,
    fromUtc: timeRange.fromUtc,
    toUtc: timeRange.toUtc,
    pageNumber: currentPage,
    pageSize,
  });

  const totalPages = entryExitData?.totalPages || 0;
  const records = entryExitData?.records || [];

  // Format time from to "07:52 AM"
  const formatTime = (dateString: string | null): string => {
    if (!dateString) return "--";
    try {
      const [, timePart] = dateString.split(" ");
      const [hours, minutes] = timePart.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${String(displayHour).padStart(2, "0")}:${minutes} ${ampm}`;
    } catch {
      return dateString;
    }
  };

  // Format dwell time from minutes to "MM:SS" format
  const formatDwellTime = (minutes: number | null): string => {
    if (minutes === null || minutes === undefined) return "--";
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Capitalize first letter
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get initials from person name
  const getInitials = (name: string): string => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    // Get first letter of first name and first letter of last name
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Generate a color based on person name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination Numbers with Sliding Window
  const getPaginationNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const total = totalPages;
    const windowSize = 5;

    if (total <= windowSize + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Calculate window boundaries
    let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const endPage = Math.min(total, startPage + windowSize - 1);

    // Adjust if we're near the end
    if (endPage - startPage < windowSize - 1) {
      startPage = Math.max(1, endPage - windowSize + 1);
    }

    // Always show first page if not in window
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Add pages in the window
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page if not in window
    if (endPage < total) {
      if (endPage < total - 1) {
        pages.push("...");
      }
      pages.push(total);
    }

    return pages;
  };

  return (
    <div className="mt-5 flex w-full flex-col overflow-hidden">
      {/* Table */}
      <div className="mb-2 w-full bg-white">
        <div className="h-125 overflow-hidden rounded-lg border border-[#E8E8E8]">
          <table className="h-full w-full table-fixed border-collapse">
            {/* Header */}
            <thead>
              <tr className="bg-[#E8E8E8]">
                <th className="w-1/5 border-b border-[#E8E8E8] px-4 py-3 text-left text-sm font-medium text-[#1E1E1F]">
                  Name
                </th>
                <th className="w-1/5 border-b border-[#E8E8E8] px-4 py-3 text-left text-sm font-medium text-[#1E1E1F]">
                  Sex
                </th>
                <th className="w-1/5 border-b border-[#E8E8E8] px-4 py-3 text-left text-sm font-medium text-[#1E1E1F]">
                  Entry
                </th>
                <th className="w-1/5 border-b border-[#E8E8E8] px-4 py-3 text-left text-sm font-medium text-[#1E1E1F]">
                  Exit
                </th>
                <th className="w-1/5 border-b border-[#E8E8E8] px-4 py-3 text-left text-sm font-medium text-[#1E1E1F]">
                  Dwell Time
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {isLoading ? (
                <tr className="h-full">
                  <td colSpan={5} className="h-full px-4">
                    <LoadingSpinner
                      size="md"
                      text="Loading data"
                      className="min-h-[400px]"
                    />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    Error loading entries
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No entries found
                  </td>
                </tr>
              ) : (
                records.map((entry) => (
                  <tr
                    key={entry.personId}
                    className="border-b border-[#E8E8E8] bg-white"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white ${getAvatarColor(entry.personName)}`}
                        >
                          {getInitials(entry.personName)}
                        </div>
                        <span className="text-sm text-[#1E1E1F]">
                          {entry.personName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-[#1E1E1F]">
                      {capitalize(entry.gender)}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-[#1E1E1F]">
                      {formatTime(entry.entryLocal)}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-[#1E1E1F]">
                      {formatTime(entry.exitLocal)}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-[#1E1E1F]">
                      {formatDwellTime(entry.dwellMinutes)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex h-8 items-center justify-center gap-2 bg-white">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isLoading}
            className="flex h-6 w-6 items-center justify-center rounded text-[#1E1E1F] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPaginationNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page as number)}
                disabled={isLoading}
                className={`h-6 min-w-6 px-2 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "text-[#1E1E1F] underline decoration-teal-600 underline-offset-4"
                    : "text-gray-500 hover:text-[#1E1E1F]"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isLoading}
            className="flex h-6 w-6 items-center justify-center rounded text-[#1E1E1F] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
