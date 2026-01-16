"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const signUp = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#448bfc] via-[#2563eb] to-[#1e40af] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Bevy Logo */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-extrabold text-white mb-2 tracking-tight">
            Bevy
          </h1>
          <div className="h-2 bg-gradient-to-r from-[#60a5fa] to-[#93c5fd] rounded-full w-32 mx-auto"></div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#448bfc] focus:outline-none transition-colors text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#448bfc] focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={signIn}
              className="w-full bg-gradient-to-r from-[#448bfc] to-[#2563eb] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Sign In
            </button>

            <button
              onClick={signUp}
              className="w-full border-2 border-[#448bfc] text-[#448bfc] py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="text-center pt-4">
            <a href="#" className="text-sm text-[#448bfc] hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>

        <p className="text-center text-blue-100 text-sm mt-6">
          Secure payments powered by Stripe
        </p>
      </div>
    </div>
  );
}