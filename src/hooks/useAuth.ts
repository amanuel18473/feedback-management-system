// "use client";

// import { useState } from "react";
// import { signInUser, signUpUser } from "@/services/authService";
// import { SignInPayload, SignUpPayload, SignInResponse } from "@/types/user.type";

// // Sign Up hook (unchanged)
// export const useSignUp = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   const signUp = async (data: SignUpPayload) => {
//     setLoading(true);
//     setError(null);
//     setSuccess(false);
//     try {
//       await signUpUser(data);
//       setSuccess(true);
//     } catch (err: any) {
//       setError(err?.message || "Sign up failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, error, success, signUp };
// };

// // Sign In hook (fixed)
// export const useSignIn = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [user, setUser] = useState<SignInResponse["user"] | null>(() => {
//     if (typeof window === "undefined") return null;
//     try {
//       const saved = localStorage.getItem("user");
//       if (!saved || saved === "undefined") return null;
//       return JSON.parse(saved);
//     } catch {
//       localStorage.removeItem("user");
//       return null;
//     }
//   });

//   const signIn = async (data: SignInPayload) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await signInUser(data);

//       // Store tokens & user in localStorage
//       localStorage.setItem("accessToken", res.accessToken);
//       localStorage.setItem("refreshToken", res.refreshToken);
//       localStorage.setItem("user", JSON.stringify(res.user));

//       setUser(res.user);
//     } catch (err: any) {
//       setError(err?.message || "Sign-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return { loading, error, user, signIn, signOut };
// };
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

// Sign In hook
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

  const router = useRouter(); // use for redirect on logout

  const signIn = async (data: SignInPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInUser(data);

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      setUser(res.user);
    } catch (err: any) {
      setError(err?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Reset user state
    setUser(null);

    // Redirect to sign-in page
    router.push("/signin");
  };

  return { loading, error, user, signIn, signOut };
};
