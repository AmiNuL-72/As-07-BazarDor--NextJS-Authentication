"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category, TickerItem } from "@/types";
import {
  getCategories,
  getProducts,
  mapProductsToTickerItems,
  DEFAULT_CATEGORIES,
  DEFAULT_TICKER_ITEMS,
} from "@/services/bazarApi";

function NavbarContent() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(DEFAULT_TICKER_ITEMS);
  const [activeCategory, setActiveCategory] = useState<string>("chal");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    // Generate Bangla date
    const formattedDate = new Date().toLocaleDateString("bn-BD", {
      dateStyle: "full",
    });
    setDate(formattedDate);

    const savedAuth = localStorage.getItem("bazar_logged_in");
    if (savedAuth === "true") {
      setIsLoggedIn(true);
    }

    // Fetch data from API with fallback
    async function fetchNavbarData() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        if (cats && cats.length > 0) {
          setCategories(cats);
          if (!activeCategory && cats[0]) {
            setActiveCategory(cats[0].id);
          }
        }

        if (prods && prods.length > 0) {
          setTickerItems(mapProductsToTickerItems(prods));
        }
      } catch (error) {
        console.error("Error fetching navbar data:", error);
      }
    }

    fetchNavbarData();
  }, []);

  const handleToggleAuth = (status: boolean) => {
    setIsLoggedIn(status);
    localStorage.setItem("bazar_logged_in", status ? "true" : "false");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 z-50">
      {/* 1. Top Row: Logo + Date & Auth Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo on Left */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform active:scale-[0.99]"
          >
            {/* Green Rounded Box with Shopping Cart */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0b7a48] flex items-center justify-center shadow-sm text-white group-hover:bg-[#08683c] transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>

            {/* Brand Title + Bangla Date */}
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">
                বাজার দর
              </span>
              <span className="text-xs sm:text-[13px] text-gray-500 font-normal leading-snug">
                {date || "আজকের তারিখ লোড হচ্ছে..."}
              </span>
            </div>
          </Link>

          {/* Right-side Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0b7a48] transition-colors rounded-lg hover:bg-gray-50"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/register"
                  className="px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-[#0b7a48] hover:bg-[#08683c] rounded-lg shadow-sm transition-all hover:shadow active:scale-[0.98]"
                >
                  সাইন আপ
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Profile Pill */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-900 hover:bg-emerald-100/70 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0b7a48] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    আ
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    প্রোফাইল
                  </span>
                </Link>

                {/* Sign-out Button */}
                <button
                  type="button"
                  onClick={() => handleToggleAuth(false)}
                  className="px-3 sm:px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200/80 rounded-lg transition-colors cursor-pointer"
                  title="সাইন আউট করুন"
                >
                  সাইন আউট
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Navigation Links in Second Row / Middle — Category Links from API */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start md:justify-center overflow-x-auto py-2.5 gap-1.5 sm:gap-2.5 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}` || (pathname === '/' && activeCategory === cat.id);
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm sm:text-[14.5px] transition-all whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? "bg-[#0b7a48] text-white font-semibold shadow-xs"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 font-medium"
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Price Ticker (Marquee) Below Navbar with API Data */}
      <div className="w-full bg-[#f9faf9] border-y border-gray-200/80 overflow-hidden py-2 select-none">
        <div className="relative flex overflow-x-hidden">
          {/* Track 1 + Track 2 for infinite looping marquee */}
          <div className="animate-marquee flex items-center shrink-0">
            {tickerItems.map((item, index) => (
              <div
                key={`track1-${item.id}-${index}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-0.5 border-r border-gray-200/90 whitespace-nowrap text-xs sm:text-[13px]"
              >
                <span className="text-sm">{item.emoji}</span>
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-semibold text-gray-900">
                  {item.price} {item.unit}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 font-bold ${
                    item.trend === "up"
                      ? "text-red-500"
                      : item.trend === "down"
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.trend === "up" && "▲"}
                  {item.trend === "down" && "▼"}
                  {(item.trend === "flat" || item.trend === "neutral") && "–"}
                  <span>{item.change}</span>
                </span>
              </div>
            ))}
          </div>

          <div
            className="animate-marquee flex items-center shrink-0"
            aria-hidden="true"
          >
            {tickerItems.map((item, index) => (
              <div
                key={`track2-${item.id}-${index}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-0.5 border-r border-gray-200/90 whitespace-nowrap text-xs sm:text-[13px]"
              >
                <span className="text-sm">{item.emoji}</span>
                <span className="font-medium text-gray-800">{item.name}</span>
                <span className="font-semibold text-gray-900">
                  {item.price} {item.unit}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 font-bold ${
                    item.trend === "up"
                      ? "text-red-500"
                      : item.trend === "down"
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.trend === "up" && "▲"}
                  {item.trend === "down" && "▼"}
                  {(item.trend === "flat" || item.trend === "neutral") && "–"}
                  <span>{item.change}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
export default function Navbar() {
  return (
    <React.Suspense fallback={<div className="h-20 bg-white" />}>
      <NavbarContent />
    </React.Suspense>
  );
}