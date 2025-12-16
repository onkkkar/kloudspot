import { useState, useRef } from "react";
import { Calendar } from "lucide-react";

interface PageHeaderProps {
  title: string;
  dateText?: string;
}

export function PageHeader({ title, dateText = "Today" }: PageHeaderProps) {
  const [selectedDate, setSelectedDate] = useState<string>(dateText);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();

      if (isToday) {
        setSelectedDate("Today");
      } else {
        setSelectedDate(
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        );
      }
    }
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mb-2 flex h-11 items-center justify-between px-8">
      {/* Left: Title */}
      <h1 className="text-xl text-[20px] font-medium text-[#1E1E1F]">
        {title}
      </h1>

      {/* Right: Calendar Selector */}
      <div className="relative">
        <button
          onClick={handleButtonClick}
          className="flex h-10 w-50 items-center gap-1 rounded-md border border-gray-300 bg-white py-2 pr-3 pl-3 transition-colors hover:bg-gray-50"
        >
          <Calendar className="h-5 w-5 text-[#1E1E1F]" strokeWidth={1.5} />
          <span className="text-base font-normal text-[#1E1E1F]">
            {selectedDate}
          </span>
        </button>

        {/* Hidden Date Input */}
        <input
          ref={dateInputRef}
          type="date"
          className="pointer-events-none absolute opacity-0"
          defaultValue={formatDateForInput(new Date())}
          onChange={handleDateSelect}
        />
      </div>
    </div>
  );
}
