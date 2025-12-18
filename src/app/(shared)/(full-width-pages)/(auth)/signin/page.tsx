// src/app/(shared)/(full-width-pages)/(auth)/signin/page.tsx
import SignInForm from "@/components/auth/SignInForm"; // client component
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin",
  description: "Sign in to TailAdmin Dashboard",
};

// Server component can import client component safely
export default function SignInPage() {
  return <SignInForm />; // client component inside server component ✅
}
