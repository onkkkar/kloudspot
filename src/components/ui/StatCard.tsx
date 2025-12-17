import { TrendingUp, TrendingDown } from "lucide-react";

// Stat Card Props
interface StatCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  percentage: string;
  comparisonText: string;
  isLoading?: boolean;
}

// Stat Card Component
export function StatCard({
  title,
  value,
  trend,
  percentage,
  comparisonText,
  isLoading = false,
}: StatCardProps) {
  // Determine trend direction
  const isUp = trend === "up";

  // Trend Icon
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  // Trend Color
  const trendColor = isUp ? "text-green-600" : "text-red-600";

  return (
    // Stat Card Container
    <div className="relative rounded-lg border border-gray-200 bg-white p-4">
      {/* Title */}
      <h3 className="mb-3 text-sm font-normal text-[#1E1E1F]">{title}</h3>
      <div className="mb-3 text-3xl font-bold text-[#1E1E1F]">
        {isLoading ? (
          <span className="animate-pulse text-gray-400">...</span>
        ) : (
          value
        )}
      </div>
      {/* Trend Container */}
      <div className="flex flex-col items-start gap-1.5 text-left">
        {isLoading ? (
          <span className="animate-pulse text-xs text-gray-400">...</span>
        ) : (
          <>
            {/* Trend Icon */}
            <div>
              <TrendIcon
                className={`h-4 w-4 ${trendColor}`}
                strokeWidth={2.5}
              />
            </div>
            {/* Trend % & Comparison Text */}
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-medium ${trendColor}`}>
                {percentage}
              </span>
              <span className="text-sm text-gray-500">{comparisonText}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
