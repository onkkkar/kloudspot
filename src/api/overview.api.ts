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

export const getDwellTime = async (
  request: DwellTimeRequest,
): Promise<DwellTimeResponse> => {
  try {
    const response = await Axios.post<DwellTimeResponse>(
      "analytics/dwell",
      request,
    );

    // console.log("Dwell Time response:", response.data);
    return response.data;
  } catch (err: unknown) {
    console.error("Dwell Time error:", err);
    throw err;
  }
};

// Footfall API endpoints
export const getFootfall = async (
  request: FootfallRequest,
): Promise<FootfallResponse> => {
  try {
    const response = await Axios.post<FootfallResponse>(
      "analytics/footfall",
      request,
    );

    // console.log("Footfall response:", response.data);
    return response.data;
  } catch (err: unknown) {
    console.error("Footfall error:", err);
    throw err;
  }
};

// Occupancy API endpoints
export const getOccupancy = async (
  request: OccupancyRequest,
): Promise<OccupancyResponse> => {
  try {
    const response = await Axios.post<OccupancyResponse>(
      "analytics/occupancy",
      request,
    );

    // console.log("Occupancy response:", response.data);
    return response.data;
  } catch (err: unknown) {
    console.error("Occupancy error:", err);
    throw err;
  }
};

// Demographics API endpoints
export const getDemographics = async (
  request: DemographicsRequest,
): Promise<DemographicsResponse> => {
  try {
    const response = await Axios.post<DemographicsResponse>(
      "analytics/demographics",
      request,
    );

    // console.log("Demographics response:", response.data);
    return response.data;
  } catch (err: unknown) {
    console.error("Demographics error:", err);
    throw err;
  }
};
