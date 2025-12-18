// Sign Up
export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  role: "Admin" | "User" | "Manager";
}

export interface SignUpResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

// Sign In
export interface SignInPayload {
  email: string;
  password: string;
  // rememberMe: boolean;
}

// Updated SignInResponse to include both tokens
export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}
