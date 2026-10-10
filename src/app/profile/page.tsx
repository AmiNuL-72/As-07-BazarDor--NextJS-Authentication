"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login?from=/profile");
      } else if (session.user) {
        const timer = setTimeout(() => {
          setName((prev) => prev || session.user.name || "");
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.updateUser({
        name: name,
      });
      
      if (error) {
        toast.error(error.message || "তথ্য আপডেট করতে সমস্যা হয়েছে।");
      } else {
        toast.success("তথ্য সফলভাবে আপডেট করা হয়েছে!");
      }
    } catch (error) {
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন।");
      router.push("/login");
    } catch (error) {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-180px)] py-8 sm:py-12 bg-[#f4f5f4] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-[#0b7a48]"></span>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  const email = session.user.email || "";

  return (
    <div className="min-h-[calc(100vh-180px)] py-8 sm:py-12 bg-[#f4f5f4]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left pt-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1">আমার প্রোফাইল</h1>
          <p className="text-sm text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
              <img 
                src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/ /g, '')}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            সাইন আউট
          </button>
        </div>

        {/* Update Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-12">
          <h3 className="text-base font-bold text-gray-900 mb-5">তথ্য</h3>
          
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b7a48]/20 focus:border-[#0b7a48] transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-full px-6 py-2.5 bg-[#0b7a48] hover:bg-[#08683c] disabled:opacity-60 text-white font-semibold rounded-lg shadow-sm transition-all text-sm cursor-pointer mt-2"
            >
              {loading ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}