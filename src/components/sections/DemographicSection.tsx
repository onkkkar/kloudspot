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

// Fixed data for donut chart
const donutData = [
  { name: "Females", value: 45, color: "#47B2B066" },
  { name: "Males", value: 55, color: "#2A7F7D99" },
];

const demographicsData = [
  { time: "8:00", timeIndex: 0, male: 185, female: 140 },
  { time: "9:00", timeIndex: 1, male: 188, female: 142 },
  { time: "10:00", timeIndex: 2, male: 190, female: 145 },
  { time: "11:00", timeIndex: 3, male: 195, female: 148 },
  { time: "12:00", timeIndex: 4, male: 192, female: 150 },
  { time: "13:00", timeIndex: 5, male: 198, female: 152 },
  { time: "14:00", timeIndex: 6, male: 200, female: 155 },
  { time: "15:00", timeIndex: 7, male: 205, female: 158 },
  { time: "16:00", timeIndex: 8, male: 210, female: 160 },
  { time: "17:00", timeIndex: 9, male: 215, female: 162 },
  { time: "18:00", timeIndex: 10, male: 220, female: 165 },
];

export function DemographicSection() {
  return (
    <div className="flex gap-2">
      {/* Chart of Demographics - Donut Chart */}
      <div className="2-82 flex h-93.75 shrink-0 flex-col rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-6 text-lg font-medium text-[#1E1E1F]">
          Chart of Demographics
        </h2>
        <div className="flex h-76.75 w-74 flex-col items-start gap-4">
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
                  100%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <FaMale className="h-7.75 w-3 shrink-0 text-[#2A7F7D99]" />
              <span className="text-sm text-[#1E1E1F]">
                <span className="font-medium">55%</span> Males
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaFemale className="h-7.75 w-3 shrink-0 text-[#47B2B066]" />
              <span className="text-sm text-[#1E1E1F]">
                <span className="font-medium">45%</span> Females
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics Analysis - Line Chart */}
      <div className="flex h-108 flex-1 flex-col rounded-lg border border-gray-200 bg-white p-4">
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
          <ResponsiveContainer width="100%" height="100%" minHeight={0}>
            <LineChart
              data={demographicsData}
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
                domain={[-0.5, 10.5]}
                label={{ value: "Time", position: "bottom", offset: 2 }}
                stroke="#1E1E1F"
                strokeOpacity={0.3}
                tick={{ fill: "#1E1E1F", fontSize: 11 }}
                tickLine={false}
                tickFormatter={(value) => {
                  const dataPoint = demographicsData.find(
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
        </div>
      </div>
    </div>
  );
}
