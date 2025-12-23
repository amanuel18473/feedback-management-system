
"use client";

import { useState } from "react";
import { signInUser, signUpUser } from "@/services/authService";
import { SignInPayload, SignUpPayload, SignInResponse } from "@/types/user.type";
import { useRouter } from "next/navigation";

// Sign Up hook (unchanged)
export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signUp = async (data: SignUpPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await signUpUser(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, signUp };
};

export const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<SignInResponse["user"] | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("user");
      if (!saved || saved === "undefined") return null;
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const router = useRouter();

  const signIn = async (data: SignInPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInUser(data); // returns { user, accessToken, refreshToken }

      // Store tokens separately
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      setUser(res.user);

      // Navigate based on role
      if (res.user.role === "admin") router.push("/admin");
      else router.push("/client");
    } catch (err: any) {
      setError(err?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/signin");
  };

  return { loading, error, user, signIn, signOut };
};
