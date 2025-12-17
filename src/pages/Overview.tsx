import { OccupancySection } from "../components/sections/OccupancySection";
import { OccupancyChartSection } from "../components/sections/OccupancyChartSection";
import { DemographicSection } from "../components/sections/DemographicSection";

// Overview Page
export function Overview() {
  return (
    // Overview Page Container
    <div className="flex flex-col gap-4 px-2 pt-5 sm:px-4 lg:gap-6 lg:px-6">
      {/* Occupancy Section */}
      <section className="flex flex-col" aria-label="Occupancy">
        <div className="mb-3">
          <h2 className="text-lg font-medium text-[#1E1E1F]">Occupancy</h2>
          {/* Occupancy Section Container */}
        </div>
        <div className="min-h-[160px] w-full">
          <OccupancySection />
        </div>
      </section>

      {/* Overall Occupancy Chart Section */}
      <section className="flex flex-col" aria-label="Overall occupancy chart">
        <div className="min-h-[300px] w-full lg:h-[374px]">
          <OccupancyChartSection />
        </div>
      </section>

      {/* Demographics Section */}
      <section
        className="mb-10 flex flex-col"
        aria-label="Demographics analysis"
      >
        <div className="mb-3">
          <h2 className="mt-3 text-lg font-medium text-[#1E1E1F]">
            Demographics
          </h2>
        </div>
        <div className="w-full">
          <DemographicSection />
        </div>
      </section>
    </div>
  );
}
