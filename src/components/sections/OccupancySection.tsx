import { TrendingUp, TrendingDown } from "lucide-react";
import { useDwellTime, useFootfall, useOccupancy } from "../../hooks";
import { useMemo, useState, useEffect } from "react";

// Occupancy Card Props
interface OccupancyCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  percentage: string;
  comparisonText: string;
  isLoading?: boolean;
}

function OccupancyCard({
  title,
  value,
  trend,
  percentage,
  comparisonText,
  isLoading = false,
}: OccupancyCardProps) {
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

// Formats dwell time from minutes to "XXmin XXsec" format
function formatDwellTime(avgDwellMinutes: number): string {
  if (!avgDwellMinutes || avgDwellMinutes === 0) {
    return "00min 00sec";
  }

  // Convert total seconds to minutes and seconds
  const totalSeconds = Math.round(avgDwellMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format minutes and seconds with leading zeros
  return `${String(minutes).padStart(2, "0")}min ${String(seconds).padStart(2, "0")}sec`;
}

export function OccupancySection() {
  // Extract siteId from API for subsequent calls
  const [siteId, setSiteId] = useState<string | null>(
    "b0fa4e2a-2159-42e7-b97b-2a9d481158f6",
  );

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

  // Fetch dwell time data
  const {
    data: dwellTimeData,
    isLoading: isDwellTimeLoading,
    error: dwellTimeError,
  } = useDwellTime(
    siteId
      ? {
          siteId,
          fromUtc: timeRange.fromUtc,
          toUtc: timeRange.toUtc,
        }
      : null,
    {
      refetchInterval: 30000,
    },
  );

  // Fetch footfall data
  const {
    data: footfallData,
    isLoading: isFootfallLoading,
    error: footfallError,
  } = useFootfall(
    siteId
      ? {
          siteId,
          fromUtc: timeRange.fromUtc,
          toUtc: timeRange.toUtc,
        }
      : null,
    {
      refetchInterval: 30000,
    },
  );

  // Fetch occupancy data
  const {
    data: occupancyData,
    isLoading: isOccupancyLoading,
    error: occupancyError,
  } = useOccupancy(
    siteId
      ? {
          siteId,
          fromUtc: timeRange.fromUtc,
          toUtc: timeRange.toUtc,
        }
      : null,
    {
      refetchInterval: 30000,
    },
  );

  // Update siteId from API response when available
  useEffect(() => {
    const newSiteId =
      dwellTimeData?.siteId || footfallData?.siteId || occupancyData?.siteId;
    if (newSiteId && newSiteId !== siteId) {
      setSiteId(newSiteId);
    }
  }, [dwellTimeData, footfallData, occupancyData, siteId]);

  // Format dwell time value
  const dwellTimeValue = useMemo(() => {
    if (dwellTimeError) return "N/A";
    if (!dwellTimeData) return "08min 30sec";

    if (
      typeof dwellTimeData.avgDwellMinutes !== "number" ||
      isNaN(dwellTimeData.avgDwellMinutes)
    ) {
      return "08min 30sec";
    }

    return formatDwellTime(dwellTimeData.avgDwellMinutes);
  }, [dwellTimeData, dwellTimeError]);

  // Format footfall value with comma separators
  const footfallValue = useMemo(() => {
    if (footfallError) return "N/A";
    if (!footfallData) return "2,436";

    if (
      typeof footfallData.footfall !== "number" ||
      isNaN(footfallData.footfall)
    ) {
      return "2,436";
    }

    return footfallData.footfall.toLocaleString();
  }, [footfallData, footfallError]);

  // Extract live occupancy from the most recent non-zero bucket (from the end of the array)
  const liveOccupancyValue = useMemo(() => {
    if (occupancyError) return "N/A";
    if (!occupancyData?.buckets || occupancyData.buckets.length === 0) {
      return "734";
    }

    // Traverse from the end of the array to find the most recent non-zero avg
    for (let i = occupancyData.buckets.length - 1; i >= 0; i--) {
      const bucket = occupancyData.buckets[i];
      if (bucket.avg > 0) {
        return Math.round(bucket.avg).toString();
      }
    }

    // If all buckets are zero, return the last bucket's value
    const lastBucket = occupancyData.buckets[occupancyData.buckets.length - 1];
    return lastBucket ? Math.round(lastBucket.avg).toString() : "734";
  }, [occupancyData, occupancyError]);

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <OccupancyCard
        title="Live Occupancy"
        value={liveOccupancyValue}
        trend="up"
        percentage="10% More"
        comparisonText="than yesterday"
        isLoading={isOccupancyLoading}
      />
      <OccupancyCard
        title="Today's Footfall"
        value={footfallValue}
        trend="down"
        percentage="10% Less"
        comparisonText="than yesterday"
        isLoading={isFootfallLoading}
      />
      <OccupancyCard
        title="Avg Dwell Time"
        value={dwellTimeValue}
        trend="up"
        percentage="6% More"
        comparisonText="than yesterday"
        isLoading={isDwellTimeLoading}
      />
    </div>
  );
}
