// Login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response type
export interface LoginResponse {
  token: string;
}
