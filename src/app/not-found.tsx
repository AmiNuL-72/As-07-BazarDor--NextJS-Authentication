import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 text-center py-20">
      <div className="text-8xl mb-6">🏜️</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">পৃষ্ঠাটি পাওয়া যায়নি (404)</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
        দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা সম্ভবত মুছে ফেলা হয়েছে অথবা লিংকটি ভুল।
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#0b7a48] text-white font-semibold rounded-lg shadow-sm hover:bg-[#08683c] transition-all inline-flex items-center gap-2"
      >
        <span>←</span> হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}