"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo auth — set cookie and redirect
    if (email && password.length >= 4) {
      document.cookie = "bazar_auth=true; path=/; max-age=86400";
      localStorage.setItem("bazar_logged_in", "true");
      router.push(from);
    } else {
      setError("ইমেইল ও পাসওয়ার্ড দিন (কমপক্ষে ৪ অক্ষর)।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">সাইন ইন করুন</h1>
          <p className="mt-2 text-sm text-gray-500">
            বিস্তারিত দাম দেখতে আপনার অ্যাকাউন্টে প্রবেশ করুন।
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200/80 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">ইমেইল</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b7a48]/20 focus:border-[#0b7a48] transition-all placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">পাসওয়ার্ড</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b7a48]/20 focus:border-[#0b7a48] transition-all placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#0b7a48] hover:bg-[#08683c] disabled:opacity-60 text-white font-semibold rounded-lg shadow-sm transition-all text-sm cursor-pointer"
            >
              {loading ? "লোড হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="font-semibold text-[#0b7a48] hover:underline">
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <Link href="/" className="mt-6 text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}