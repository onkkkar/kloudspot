import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaFemale, FaMale } from "react-icons/fa";
import { useDemographics } from "../../hooks/useDemographics";
import { LoadingSpinner } from "../ui";

export function DemographicSection() {
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

  // Fetch demographics data
  const {
    data: demographicsData,
    isLoading: isDemographicsLoading,
    error: demographicsError,
  } = useDemographics(
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
    if (demographicsData?.siteId && demographicsData.siteId !== siteId) {
      setSiteId(demographicsData.siteId);
    }
  }, [demographicsData, siteId]);

  // Transform API data for line chart
  const chartData = useMemo(() => {
    if (!demographicsData?.buckets) return [];

    return demographicsData.buckets
      .filter((bucket) => bucket.male > 0 || bucket.female > 0) // Filter out zero values
      .map((bucket, index) => {
        // Extract time from local string
        const timeMatch = bucket.local.match(/(\d{1,2}):\d{2}:\d{2}/);
        const time = timeMatch ? timeMatch[1] + ":00" : "";

        return {
          time,
          timeIndex: index,
          male: Math.round(bucket.male),
          female: Math.round(bucket.female),
        };
      });
  }, [demographicsData]);

  // Calculate totals and percentages for donut chart
  const donutData = useMemo(() => {
    if (!demographicsData?.buckets) {
      return [
        { name: "Females", value: 0, color: "#47B2B066" },
        { name: "Males", value: 0, color: "#2A7F7D99" },
      ];
    }

    const totalMale = demographicsData.buckets.reduce(
      (sum, bucket) => sum + bucket.male,
      0,
    );
    const totalFemale = demographicsData.buckets.reduce(
      (sum, bucket) => sum + bucket.female,
      0,
    );
    const total = totalMale + totalFemale;

    if (total === 0) {
      return [
        { name: "Females", value: 0, color: "#47B2B066" },
        { name: "Males", value: 0, color: "#2A7F7D99" },
      ];
    }

    const malePercentage = Math.round((totalMale / total) * 100);
    const femalePercentage = Math.round((totalFemale / total) * 100);

    return [
      { name: "Females", value: femalePercentage, color: "#47B2B066" },
      { name: "Males", value: malePercentage, color: "#2A7F7D99" },
    ];
  }, [demographicsData]);

  // Calculate percentages for display
  const malePercentage = donutData.find((d) => d.name === "Males")?.value || 0;
  const femalePercentage =
    donutData.find((d) => d.name === "Females")?.value || 0;

  // Calculate max value for Y-axis
  const maxValue = useMemo(() => {
    if (!chartData.length) return 100;
    const max = Math.max(...chartData.map((d) => Math.max(d.male, d.female)));

    // Round up to nearest 50
    return Math.ceil(max / 50) * 50;
  }, [chartData]);
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      {/* Donut Chart */}
      <div className="flex h-auto min-h-[300px] shrink-0 flex-col rounded-lg border border-gray-200 bg-white p-4 lg:h-93.75 lg:w-82">
        <h2 className="mb-6 text-lg font-medium text-[#1E1E1F]">
          Chart of Demographics
        </h2>
        <div className="flex h-auto w-full flex-col items-start gap-4 lg:h-76.75 lg:w-74">
          {isDemographicsLoading ? (
            <div className="flex h-44 w-44 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#009490]"></div>
            </div>
          ) : demographicsError ? (
            <div className="flex h-44 w-44 items-center justify-center text-sm text-red-500">
              Error
            </div>
          ) : (
            <>
              <div className="h-44 w-44">
                <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      cornerRadius={8}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      fill="#1E1E1F"
                      fontSize={14}
                      fontWeight="normal"
                    >
                      Total Crowd
                    </text>
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      fill="#1E1E1F"
                      fontSize={16}
                      fontWeight="bold"
                    >
                      {malePercentage + femalePercentage}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <FaMale className="h-7.75 w-3 shrink-0 text-[#2A7F7D99]" />
                  <span className="text-sm text-[#1E1E1F]">
                    <span className="font-medium">{malePercentage}%</span> Males
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFemale className="h-7.75 w-3 shrink-0 text-[#47B2B066]" />
                  <span className="text-sm text-[#1E1E1F]">
                    <span className="font-medium">{femalePercentage}%</span>{" "}
                    Females
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Line Chart */}
      <div className="flex min-h-[400px] flex-1 flex-col rounded-lg border border-gray-200 bg-white p-4 lg:h-108">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-[#1E1E1F]">
            Demographics Analysis
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#2A7F7D99]"></div>
              <span className="text-xs text-[#1E1E1F]">Male</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#47B2B066]"></div>
              <span className="text-xs text-[#1E1E1F]">Female</span>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          {isDemographicsLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          ) : demographicsError ? (
            <div className="flex h-full items-center justify-center text-red-500">
              Error loading demographics data
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No demographics data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={0}>
              <LineChart
                data={chartData}
                margin={{ top: 2, right: 0, left: 10, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A7F7D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2A7F7D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#47B2B0" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#47B2B0" stopOpacity={0} />
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
                  domain={[-0.5, chartData.length - 1 + 0.5]}
                  label={{ value: "Time", position: "bottom", offset: 2 }}
                  stroke="#1E1E1F"
                  strokeOpacity={0.3}
                  tick={{ fill: "#1E1E1F", fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(value) => {
                    const dataPoint = chartData.find(
                      (d) => d.timeIndex === value,
                    );
                    return dataPoint ? dataPoint.time : "";
                  }}
                  ticks={chartData.map((_, index) => index)}
                />
                <YAxis
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                  domain={[0, maxValue]}
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
                  dataKey="male"
                  stroke="none"
                  fill="url(#colorMale)"
                />
                <Area
                  type="monotone"
                  dataKey="female"
                  stroke="none"
                  fill="url(#colorFemale)"
                />
                <Line
                  type="monotone"
                  dataKey="male"
                  stroke="#2A7F7D99"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="female"
                  stroke="#47B2B066"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
