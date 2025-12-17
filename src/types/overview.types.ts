// Dwell Time API types
export interface DwellTimeRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

// Dwell Time response type
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

// Footfall response type
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

// Occupancy bucket type
export interface OccupancyBucket {
  utc: number;
  local: string;
  avg: number;
}

// Occupancy response type
export interface OccupancyResponse {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  timezone: string;
  buckets: OccupancyBucket[];
}

// Demographics API types
export interface DemographicsRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

// Demographics bucket type
export interface DemographicsBucket {
  utc: number;
  local: string;
  male: number;
  female: number;
}

// Demographics response type
export interface DemographicsResponse {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  timezone: string;
  buckets: DemographicsBucket[];
}

// Entry-Exit API types
export interface EntryExitRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  pageNumber: number;
  pageSize: number;
}

// Entry-Exit record type
export interface EntryExitRecord {
  personId: string;
  personName: string;
  gender: "male" | "female";
  zoneId: string;
  zoneName: string;
  severity: "low" | "medium" | "high";
  entryUtc: number;
  entryLocal: string;
  exitUtc: number | null;
  exitLocal: string | null;
  dwellMinutes: number | null;
}

// Entry-Exit response type
export interface EntryExitResponse {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
  totalPages: number;
  records: EntryExitRecord[];
}
