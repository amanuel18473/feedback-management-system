import axiosInstance from "@/lib/axios-instance";
import { SignUpPayload, SignUpResponse, SignInPayload, SignInResponse } from "@/types/user.type";

// Sign Up
export const signUpUser = async (payload: SignUpPayload): Promise<SignUpResponse> => {
  try {
    const res = await axiosInstance.post<SignUpResponse>("/auth/register", payload);
    return res.data;
  } catch (err: any) {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || "Something went wrong";
      throw new Error(`Error ${status}: ${message}`);
    } else if (err.request) {
      throw new Error("No response from server. Please check your network.");
    } else {
      throw new Error(err.message || "Sign up failed");
    }
  }
};

// Sign In
export const signInUser = async (payload: SignInPayload): Promise<SignInResponse> => {
  try {
    const res = await axiosInstance.post("/auth/login", payload);

    // Backend response structure: { data: { accessToken, refreshToken, user } }
    const { accessToken, refreshToken, user } = res.data.data;

    return { accessToken, refreshToken, user };
  } catch (err: any) {
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || "Sign-in failed";
      throw new Error(`Error ${status}: ${message}`);
    } else if (err.request) {
      throw new Error("No response from server. Please check your network.");
    } else {
      throw new Error(err.message || "Sign-in failed");
    }
  }
};
