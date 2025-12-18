"use client";
import { useState } from "react";
import { useSignUp } from "@/hooks/useAuth";
import { SignUpPayload } from "@/types/user.type";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SignUpPayload["role"]>("Admin");
  const [isChecked, setIsChecked] = useState(false);

  const { loading, error, success, signUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) return alert("Please accept Terms and Conditions.");
    const payload: SignUpPayload = { fullName, email, password, role };
    await signUp(payload);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon /> Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">Sign Up</h1>
        <p className="mb-5 text-sm text-gray-500">Enter your email and password to sign up!</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@gmail.com" />
          </div>
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>
          </div>
          <div>
            <Label>Role</Label>
            <select value={role} onChange={(e) => setRole(e.target.value as SignUpPayload["role"])} className="w-full px-3 py-2 border rounded-lg">
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <p className="text-gray-500 text-sm">I agree to Terms and Privacy Policy</p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">Sign up successful!</p>}
        </form>
        <p className="mt-5 text-sm text-center text-gray-700">
          Already have an account? <Link href="/signin" className="text-brand-500">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
