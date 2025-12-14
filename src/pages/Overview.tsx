import { OccupancySection } from "../components/sections/OccupancySection";
import { OccupancyChartSection } from "../components/sections/OccupancyChartSection";
import { DemographicSection } from "../components/sections/DemographicSection";

export function Overview() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-5">
      {/* Occupancy Stats Section */}
      <div className="flex flex-col">
        <div className="mb-3">
          <h2 className="text-lg font-medium text-[#1E1E1F]">Occupancy</h2>
        </div>
        <div className="min-h-[160px] w-full">
          <OccupancySection />
        </div>
      </div>

      {/* Overall Occupancy Chart Section */}
      <div className="flex flex-col">
        <div className="h-[374px] w-full">
          <OccupancyChartSection />
        </div>
      </div>

      {/* Demographics Section */}
      <div className="mb-10 flex flex-col">
        <div className="mb-3">
          <h2 className="mt-3 text-lg font-medium text-[#1E1E1F]">
            Demographics
          </h2>
        </div>
        <div className="w-full">
          <DemographicSection />
        </div>
      </div>
    </div>
  );
}
