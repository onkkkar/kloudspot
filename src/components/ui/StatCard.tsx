import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  percentage: string;
  comparisonText: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  trend,
  percentage,
  comparisonText,
  isLoading = false,
}: StatCardProps) {
  const isUp = trend === "up";
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? "text-green-600" : "text-red-600";

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-normal text-[#1E1E1F]">{title}</h3>
      <div className="mb-3 text-3xl font-bold text-[#1E1E1F]">
        {isLoading ? (
          <span className="animate-pulse text-gray-400">...</span>
        ) : (
          value
        )}
      </div>
      <div className="flex flex-col items-start gap-1.5 text-left">
        <div>
          <TrendIcon className={`h-4 w-4 ${trendColor}`} strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium ${trendColor}`}>
            {percentage}
          </span>
          <span className="text-sm text-gray-500">{comparisonText}</span>
        </div>
      </div>
    </div>
  );
}
