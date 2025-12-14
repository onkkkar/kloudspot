import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CrowdEntry {
  id: number;
  name: string;
  sex: "Male" | "Female";
  entry: string;
  exit: string | null;
  dwellTime: string | null;
  avatar?: string;
}

const dummyData: CrowdEntry[] = [
  {
    id: 1,
    name: "Alice Johnson",
    sex: "Female",
    entry: "11:05 AM",
    exit: "11:10 AM",
    dwellTime: "00:20",
  },
  {
    id: 2,
    name: "Brian Smith",
    sex: "Male",
    entry: "10:45 AM",
    exit: "11:15 AM",
    dwellTime: "00:30",
  },
  {
    id: 3,
    name: "Catherine Lee",
    sex: "Female",
    entry: "10:30 AM",
    exit: null,
    dwellTime: null,
  },
  {
    id: 4,
    name: "David Brown",
    sex: "Male",
    entry: "10:15 AM",
    exit: "10:50 AM",
    dwellTime: "00:35",
  },
  {
    id: 5,
    name: "Emma Wilson",
    sex: "Female",
    entry: "09:55 AM",
    exit: "10:25 AM",
    dwellTime: "00:30",
  },
  {
    id: 6,
    name: "Frank Miller",
    sex: "Male",
    entry: "09:40 AM",
    exit: null,
    dwellTime: null,
  },
  {
    id: 7,
    name: "Grace Taylor",
    sex: "Female",
    entry: "09:20 AM",
    exit: "09:55 AM",
    dwellTime: "00:35",
  },
  {
    id: 8,
    name: "Henry Davis",
    sex: "Male",
    entry: "09:05 AM",
    exit: "09:40 AM",
    dwellTime: "00:35",
  },
  {
    id: 9,
    name: "Isabella Martinez",
    sex: "Female",
    entry: "08:50 AM",
    exit: "09:15 AM",
    dwellTime: "00:25",
  },
  {
    id: 10,
    name: "James Anderson",
    sex: "Male",
    entry: "08:35 AM",
    exit: null,
    dwellTime: null,
  },
  {
    id: 11,
    name: "Katherine White",
    sex: "Female",
    entry: "08:20 AM",
    exit: "08:55 AM",
    dwellTime: "00:35",
  },
];

export function CrowdEntriesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;
  const totalPages = Math.ceil(dummyData.length / entriesPerPage);

  // Calculate which entries to show on current page
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = dummyData.slice(startIndex, endIndex);

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

  return (
    <div className="flex w-full flex-col overflow-hidden">
      {/* Table */}
      <div className="mb-2 w-full bg-white">
        <div className="h-125 overflow-hidden rounded-lg border border-[#E8E8E8]">
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr className="bg-[#E8E8E8]">
                <th className="border-b border-[#E8E8E8] px-4 py-3 text-left text-sm font-medium text-[#1E1E1F]">
                  Name
                </th>
                <th className="border-b border-[#E8E8E8] px-4 py-3 text-center text-sm font-medium text-[#1E1E1F]">
                  Sex
                </th>
                <th className="border-b border-[#E8E8E8] px-4 py-3 text-center text-sm font-medium text-[#1E1E1F]">
                  Entry
                </th>
                <th className="border-b border-[#E8E8E8] px-4 py-3 text-center text-sm font-medium text-[#1E1E1F]">
                  Exit
                </th>
                <th className="border-b border-[#E8E8E8] px-4 py-3 text-center text-sm font-medium text-[#1E1E1F]">
                  Dwell Time
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {currentData.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#E8E8E8] bg-white"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 shrink-0 rounded-full bg-[#E8E8E8]"></div>
                      <span className="text-sm text-[#1E1E1F]">
                        {entry.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#1E1E1F]">
                    {entry.sex}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#1E1E1F]">
                    {entry.entry}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#1E1E1F]">
                    {entry.exit || "--"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#1E1E1F]">
                    {entry.dwellTime || "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex h-8 items-center justify-center gap-2 bg-white">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="flex h-6 w-6 items-center justify-center rounded text-[#1E1E1F] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`h-6 min-w-6 px-2 text-sm font-medium transition-colors ${
              currentPage === page
                ? "text-[#1E1E1F] underline decoration-teal-600 underline-offset-4"
                : "text-gray-500 hover:text-[#1E1E1F]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex h-6 w-6 items-center justify-center rounded text-[#1E1E1F] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
