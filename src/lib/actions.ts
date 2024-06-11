import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiRequest, ApiResponse } from "@/types/api";
import { ProfileRequest, RegisterRequest } from "@/types/user";

const axiosInstance = axios.create({
  baseURL: process.env.NEXTAUTH_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: any): never => {
  throw new Error(
    error.response?.data?.message || "An error occurred. Please try again."
  );
};

const apiCall = async <T>(
  method: AxiosRequestConfig["method"],
  url: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = { method, url, data, params };
    const response: AxiosResponse<T> = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
  return Promise.reject(new Error("Unhandled error occurred"));
};

export const registerUser = (data: RegisterRequest): Promise<ApiResponse> => {
  return apiCall<ApiResponse>("post", "/auth/register", data);
};

export const sendForgotPasswordEmail = (
  data: ApiRequest
): Promise<ApiResponse> => {
  return apiCall<ApiResponse>(
    "post",
    "/auth/account/forgot-password/send-email",
    { email: data.email }
  );
};

export const verifyPasswordToken = (data: ApiRequest): Promise<ApiResponse> => {
  return apiCall<ApiResponse>(
    "get",
    "/auth/account/forgot-password",
    undefined,
    { email: data.email, token: data.token }
  );
};

export const resetPassword = (data: ApiRequest): Promise<ApiResponse> => {
  return apiCall<ApiResponse>("post", "/auth/account/forgot-password", {
    email: data.email,
    password: data.password,
  });
};

export const verifyEmailToken = (data: ApiRequest): Promise<ApiResponse> => {
  return apiCall<ApiResponse>("get", "/auth/account/verify", undefined, {
    email: data.email,
    token: data.token,
  });
};

export const fetchUserData = (data: ApiRequest): Promise<ApiResponse> => {
  return apiCall<ApiResponse>("get", "/user", undefined, { email: data.email });
};

export const updateProfile = (data: ProfileRequest): Promise<ApiResponse> => {
  return apiCall<ApiResponse>("put", "/user", data);
};

export const deleteAccount = (): Promise<ApiResponse> => {
  return apiCall<ApiResponse>("delete", "/user");
};
