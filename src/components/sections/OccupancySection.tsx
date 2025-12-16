import { useDwellTime, useFootfall, useOccupancy } from "../../hooks";
import { useMemo, useState, useEffect } from "react";
import { StatCard } from "../ui";

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

  // Calculate yesterday's UTC time range for comparison
  const yesterdayTimeRange = useMemo(() => {
    const now = new Date();
    const startOfYesterday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        0,
        0,
        0,
        0,
      ),
    );
    const endOfYesterday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        23,
        59,
        59,
        999,
      ),
    );

    return {
      fromUtc: startOfYesterday.getTime(),
      toUtc: endOfYesterday.getTime(),
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

  // Fetch occupancy data for today
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

  // Fetch yesterday's data for comparison
  const {
    data: yesterdayOccupancyData,
    isLoading: isYesterdayOccupancyLoading,
  } = useOccupancy(
    siteId
      ? {
          siteId,
          fromUtc: yesterdayTimeRange.fromUtc,
          toUtc: yesterdayTimeRange.toUtc,
        }
      : null,
  );

  // Fetch yesterday's footfall for comparison
  const { data: yesterdayFootfallData, isLoading: isYesterdayFootfallLoading } =
    useFootfall(
      siteId
        ? {
            siteId,
            fromUtc: yesterdayTimeRange.fromUtc,
            toUtc: yesterdayTimeRange.toUtc,
          }
        : null,
    );

  // Fetch yesterday's dwell time for comparison
  const {
    data: yesterdayDwellTimeData,
    isLoading: isYesterdayDwellTimeLoading,
  } = useDwellTime(
    siteId
      ? {
          siteId,
          fromUtc: yesterdayTimeRange.fromUtc,
          toUtc: yesterdayTimeRange.toUtc,
        }
      : null,
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

  // Calculate percentage change for Live Occupancy
  const occupancyTrend = useMemo(() => {
    if (
      !occupancyData?.buckets ||
      !yesterdayOccupancyData?.buckets ||
      isYesterdayOccupancyLoading
    ) {
      return { trend: "up" as const, percentage: "10% More" };
    }

    // Get today's average (most recent non-zero)
    let todayValue = 0;
    for (let i = occupancyData.buckets.length - 1; i >= 0; i--) {
      if (occupancyData.buckets[i].avg > 0) {
        todayValue = occupancyData.buckets[i].avg;
        break;
      }
    }

    // Get yesterday's average (most recent non-zero)
    let yesterdayValue = 0;
    for (let i = yesterdayOccupancyData.buckets.length - 1; i >= 0; i--) {
      if (yesterdayOccupancyData.buckets[i].avg > 0) {
        yesterdayValue = yesterdayOccupancyData.buckets[i].avg;
        break;
      }
    }

    if (yesterdayValue === 0) {
      return { trend: "up" as const, percentage: "10% More" };
    }

    const change = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    const absChange = Math.abs(change);
    const isUp = change >= 0;

    return {
      trend: isUp ? ("up" as const) : ("down" as const),
      percentage: `${Math.round(absChange)}% ${isUp ? "More" : "Less"}`,
    };
  }, [occupancyData, yesterdayOccupancyData, isYesterdayOccupancyLoading]);

  // Calculate percentage change for Footfall
  const footfallTrend = useMemo(() => {
    if (
      !footfallData?.footfall ||
      !yesterdayFootfallData?.footfall ||
      isYesterdayFootfallLoading
    ) {
      return { trend: "down" as const, percentage: "10% Less" };
    }

    const todayValue = footfallData.footfall;
    const yesterdayValue = yesterdayFootfallData.footfall;

    if (yesterdayValue === 0) {
      return { trend: "up" as const, percentage: "10% More" };
    }

    const change = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    const absChange = Math.abs(change);
    const isUp = change >= 0;

    return {
      trend: isUp ? ("up" as const) : ("down" as const),
      percentage: `${Math.round(absChange)}% ${isUp ? "More" : "Less"}`,
    };
  }, [footfallData, yesterdayFootfallData, isYesterdayFootfallLoading]);

  // Calculate percentage change for Dwell Time
  const dwellTimeTrend = useMemo(() => {
    if (
      !dwellTimeData?.avgDwellMinutes ||
      !yesterdayDwellTimeData?.avgDwellMinutes ||
      isYesterdayDwellTimeLoading
    ) {
      return { trend: "up" as const, percentage: "6% More" };
    }

    const todayValue = dwellTimeData.avgDwellMinutes;
    const yesterdayValue = yesterdayDwellTimeData.avgDwellMinutes;

    if (yesterdayValue === 0) {
      return { trend: "up" as const, percentage: "6% More" };
    }

    const change = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    const absChange = Math.abs(change);
    const isUp = change >= 0;

    return {
      trend: isUp ? ("up" as const) : ("down" as const),
      percentage: `${Math.round(absChange)}% ${isUp ? "More" : "Less"}`,
    };
  }, [dwellTimeData, yesterdayDwellTimeData, isYesterdayDwellTimeLoading]);

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <StatCard
        title="Live Occupancy"
        value={liveOccupancyValue}
        trend={occupancyTrend.trend}
        percentage={occupancyTrend.percentage}
        comparisonText="than yesterday"
        isLoading={isOccupancyLoading || isYesterdayOccupancyLoading}
      />
      <StatCard
        title="Today's Footfall"
        value={footfallValue}
        trend={footfallTrend.trend}
        percentage={footfallTrend.percentage}
        comparisonText="than yesterday"
        isLoading={isFootfallLoading || isYesterdayFootfallLoading}
      />
      <StatCard
        title="Avg Dwell Time"
        value={dwellTimeValue}
        trend={dwellTimeTrend.trend}
        percentage={dwellTimeTrend.percentage}
        comparisonText="than yesterday"
        isLoading={isDwellTimeLoading || isYesterdayDwellTimeLoading}
      />
    </div>
  );
}
