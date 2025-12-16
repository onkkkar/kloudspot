import Axios from "./interceptor";
import type { LoginRequest, LoginResponse } from "../types";

/**
 * Login function - Authenticates user and stores token
 * @param credentials - Username and password
 * @returns Promise with login response containing token
 */
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  try {
    // Make POST request to login endpoint
    const response = await Axios.post<LoginResponse>("auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    // Store token in localStorage (interceptor will use this)
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      // Store email for profile avatar initials
      localStorage.setItem("userEmail", credentials.email);
    }

    return response.data;
  } catch (err: unknown) {
    console.error("Login error:", err);

    // Type guard for axios error
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
      };
      console.error("Response data:", axiosError.response?.data);
      console.error("Status:", axiosError.response?.status);

      // Throw error: user-friendly message
      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          "Login failed. Please check your credentials.",
      );
    }

    // Handle non-axios errors
    throw new Error(
      err instanceof Error
        ? err.message
        : "Login failed. Please check your credentials.",
    );
  }
};

/**
 * Logout function - Removes token from localStorage
 */
export const logout = (): void => {
  // Remove token from localStorage
  localStorage.removeItem("authToken");

  // Redirect to login page
  window.location.href = "/login";
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};
