// Dwell Time API types
export interface DwellTimeRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

export interface DwellTimeResponse {
  siteId: string;
  toUtc: number;
  fromUtc: number;
  avgDwellMinutes: number;
  dwellTime: number;
  dwellRecords?: number;
}

// Footfall API types
export interface FootfallRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

export interface FootfallResponse {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  footfall: number;
}

// Occupancy API types
export interface OccupancyRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

export interface OccupancyBucket {
  utc: number;
  local: string;
  avg: number;
}

export interface OccupancyResponse {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  timezone: string;
  buckets: OccupancyBucket[];
}
