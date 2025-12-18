"use client";

import { useState, useEffect } from "react";
import { useSignIn } from "@/hooks/useAuth";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, user, signIn } = useSignIn();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/"); // navigate to root page
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
    // redirect is handled by useEffect
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">Sign In</h1>
        <p className="mb-5 text-sm text-gray-500">Enter your email and password to sign in!</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="info@gmail.com"
            />
          </div>

          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/reset-password" className="text-sm text-brand-500">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </form>

        <p className="mt-5 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
