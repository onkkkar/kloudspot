// Dwell Time API endpoints
import Axios from "./interceptor";
import type {
  DwellTimeResponse,
  DwellTimeRequest,
  FootfallResponse,
  FootfallRequest,
  OccupancyResponse,
  OccupancyRequest,
  DemographicsResponse,
  DemographicsRequest,
} from "../types";
import { apiTimingTracker } from "../utils/apiTimings";

export const getDwellTime = async (
  request: DwellTimeRequest,
): Promise<DwellTimeResponse> => {
  const startTime = performance.now();
  const response = await Axios.post<DwellTimeResponse>(
    "analytics/dwell",
    request,
  );
  const duration = performance.now() - startTime;
  apiTimingTracker.record("Dwell Time", duration);
  return response.data;
};

// Footfall API endpoints
export const getFootfall = async (
  request: FootfallRequest,
): Promise<FootfallResponse> => {
  const startTime = performance.now();
  const response = await Axios.post<FootfallResponse>(
    "analytics/footfall",
    request,
  );
  const duration = performance.now() - startTime;
  apiTimingTracker.record("Footfall", duration);
  return response.data;
};

// Occupancy API endpoints
export const getOccupancy = async (
  request: OccupancyRequest,
): Promise<OccupancyResponse> => {
  const startTime = performance.now();
  const response = await Axios.post<OccupancyResponse>(
    "analytics/occupancy",
    request,
  );
  const duration = performance.now() - startTime;
  apiTimingTracker.record("Occupancy", duration);
  return response.data;
};

// Demographics API endpoints
export const getDemographics = async (
  request: DemographicsRequest,
): Promise<DemographicsResponse> => {
  const startTime = performance.now();
  const response = await Axios.post<DemographicsResponse>(
    "analytics/demographics",
    request,
  );
  const duration = performance.now() - startTime;
  apiTimingTracker.record("Demographics", duration);
  return response.data;
};
