import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useOccupancy } from "../../hooks";
import { useMemo, useState, useEffect } from "react";

// Custom label component for LIVE indicator
interface LiveLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
  value?: string;
}

const LiveLabel = ({ viewBox, value }: LiveLabelProps) => {
  if (viewBox && viewBox.x !== undefined && viewBox.y !== undefined) {
    const rectX = viewBox.x - 9;
    const rectHeight = 40;
    const rectY = 50 - rectHeight;
    const rectWidth = 18;
    const textX = rectX + rectWidth / 2;
    const textY = rectY + rectHeight / 2;

    return (
      <g>
        <rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill="#B42018"
          rx={2}
        />
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(-90 ${textX} ${textY})`}
        >
          {value}
        </text>
      </g>
    );
  }
  return null;
};

export function OccupancyChartSection() {
  // Initialize siteId with fallback value, will be updated from API response
  const [siteId, setSiteId] = useState<string | null>(
    "b0fa4e2a-2159-42e7-b97b-2a9d481158f6",
  );

  // Calculate today's UTC time range - memoized to prevent recalculation on every render
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

  // Fetch occupancy data from API with auto-refetch every 30 sec
  const {
    data: occupancyData,
    isLoading,
    error,
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

  // Update siteId state when API response contains a different siteId to ensure future calls use correct ID
  useEffect(() => {
    const newSiteId = occupancyData?.siteId;
    if (newSiteId && newSiteId !== siteId) {
      setSiteId(newSiteId);
    }
  }, [occupancyData, siteId]);

  // Transform API buckets array to chart data format
  const chartData = useMemo(() => {
    if (!occupancyData?.buckets || occupancyData.buckets.length === 0) {
      return [];
    }

    return occupancyData.buckets.map((bucket, index) => {
      // Extract time from local string
      const timeMatch = bucket.local.match(/(\d{1,2}):\d{2}:\d{2}/);
      const time = timeMatch ? timeMatch[1] + ":00" : `${index}:00`;

      return {
        time,
        timeIndex: index,
        count: Math.round(bucket.avg),
        utc: bucket.utc,
      };
    });
  }, [occupancyData]);

  // Find the most recent non-zero bucket index for LIVE indicator by traversing backwards
  const liveIndex = useMemo(() => {
    if (!chartData.length) return -1;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].count > 0) {
        return i;
      }
    }
    return chartData.length - 1;
  }, [chartData]);

  // Calculate Y-axis max value
  const maxCount = useMemo(() => {
    if (!chartData.length) return 250;
    const max = Math.max(...chartData.map((d) => d.count));

    // Round up to nearest 50
    return Math.ceil(max / 50) * 50 || 250;
  }, [chartData]);

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#1E1E1F]">
            Overall Occupancy
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#009490]"></div>
            <span className="text-sm text-[#1E1E1F]">Occupancy</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#009490]"></div>
        </div>
      </div>
    );
  }

  // Show error message if API call failed / no data
  if (error || !chartData.length) {
    return (
      <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#1E1E1F]">
            Overall Occupancy
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#009490]"></div>
            <span className="text-sm text-[#1E1E1F]">Occupancy</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <span className="text-sm text-gray-500">
            {error ? "Failed to load occupancy data" : "No data available"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#1E1E1F]">
          Overall Occupancy
        </h2>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#009490]"></div>
          <span className="text-sm text-[#1E1E1F]">Occupancy</span>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <LineChart
            data={chartData}
            margin={{ top: 2, right: 0, left: 10, bottom: 25 }}
          >
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#009490" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#009490" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              type="number"
              dataKey="timeIndex"
              domain={[-0.5, chartData.length - 0.5]}
              label={{ value: "Time", position: "bottom", offset: 2 }}
              stroke="#1E1E1F"
              strokeOpacity={0.3}
              tick={{ fill: "#1E1E1F", fontSize: 11 }}
              tickLine={false}
              tickFormatter={(value) => {
                const dataPoint = chartData.find((d) => d.timeIndex === value);
                return dataPoint ? dataPoint.time : "";
              }}
              ticks={chartData
                .filter((_, i) => i % Math.ceil(chartData.length / 10) === 0)
                .map((d) => d.timeIndex)}
            />
            <YAxis
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
              domain={[0, maxCount]}
              stroke="#1E1E1F"
              strokeOpacity={0.3}
              tick={{ fill: "#1E1E1F", fontSize: 11 }}
              tickLine={false}
              tickMargin={5}
              tickFormatter={(value) => value.toString()}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "4px",
              }}
              labelStyle={{ color: "#1E1E1F" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill="url(#colorOccupancy)"
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#009490"
              strokeWidth={2}
              dot={false}
            />
            {liveIndex >= 0 && (
              <ReferenceLine
                x={liveIndex}
                stroke="#B42018"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={<LiveLabel value="LIVE" />}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
