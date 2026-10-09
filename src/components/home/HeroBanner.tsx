"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import bazarHero from "@/assets/bazar-hero.png";

export default function HeroBanner() {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString("bn-BD", {
      dateStyle: "full",
    });
    setDate(formattedDate);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-[#f0f5f0] border border-[#e2ede2] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-hidden shadow-xs">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl text-left">
          {/* Eyebrow / Small text */}
          <div className="inline-block px-3 py-1 bg-[#d8ecd8] text-[#0b7a48] text-xs sm:text-[13px] font-semibold rounded-md mb-4 shadow-2xs">
            {date || "আজকের তারিখ লোড হচ্ছে..."}
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-gray-900 tracking-tight leading-snug sm:leading-tight mb-4">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — কাঁচাবাজারের বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং বাজার পরিবর্তন এক জায়গায়।
          </p>

          {/* Primary CTA Button */}
          <div>
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0b7a48] hover:bg-[#08683c] text-white font-semibold text-sm sm:text-base rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="flex-1 flex justify-center lg:justify-end w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <div className="relative w-56 sm:w-72 lg:w-80 h-auto">
            <Image
              src={bazarHero}
              alt="বাজার দর - তাজা শাকসবজি ও ফলমূল"
              priority
              className="w-full h-auto object-contain drop-shadow-sm select-none pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}