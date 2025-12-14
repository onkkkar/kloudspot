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

// Fixed data for the chart (will be replaced with API data later)
const occupancyData = [
  { time: "8:00", timeIndex: 0, count: 155 },
  { time: "9:00", timeIndex: 1, count: 160 },
  { time: "10:00", timeIndex: 2, count: 165 },
  { time: "11:00", timeIndex: 3, count: 175 },
  { time: "12:00", timeIndex: 4, count: 165 },
  { time: "13:00", timeIndex: 5, count: 170 },
  { time: "14:00", timeIndex: 6, count: 185 },
  { time: "15:00", timeIndex: 7, count: 190 },
  { time: "16:00", timeIndex: 8, count: 195 },
  { time: "16:30", timeIndex: 8.5, count: 198 }, // LIVE point
  { time: "17:00", timeIndex: 9, count: 200 },
  { time: "18:00", timeIndex: 10, count: 200 },
];

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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={occupancyData}
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
              domain={[-0.5, 10.5]}
              label={{ value: "Time", position: "bottom", offset: 2 }}
              stroke="#1E1E1F"
              strokeOpacity={0.3}
              tick={{ fill: "#1E1E1F", fontSize: 11 }}
              tickLine={false}
              tickFormatter={(value) => {
                const dataPoint = occupancyData.find(
                  (d) => d.timeIndex === value,
                );
                return dataPoint ? dataPoint.time : "";
              }}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            />
            <YAxis
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
              domain={[0, 250]}
              stroke="#1E1E1F"
              strokeOpacity={0.3}
              tick={{ fill: "#1E1E1F", fontSize: 11 }}
              tickLine={false}
              tickMargin={5}
              ticks={[50, 100, 150, 200, 250]}
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
            <ReferenceLine
              x={8.5}
              stroke="#B42018"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={<LiveLabel value="LIVE" />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
