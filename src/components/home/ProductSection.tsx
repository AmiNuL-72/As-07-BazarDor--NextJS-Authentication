"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, toBengaliDigits } from "@/services/bazarApi";

export default function ProductSections() {
  type SortOption = "default" | "price-asc" | "price-desc";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const topRisers = [...products]
    .filter((p) => (p.change?.pct ?? 0) > 0)
    .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
    .slice(0, 6);

  const topFallers = [...products]
    .filter((p) => (p.change?.pct ?? 0) < 0)
    .sort((a, b) => (a.change?.pct ?? 0) - (b.change?.pct ?? 0))
    .slice(0, 6);

  const sortedAllProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.today - b.today;
    if (sortBy === "price-desc") return b.today - a.today;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0b7a48] border-t-transparent mb-3" />
        <p className="text-sm text-gray-500 font-medium">পণ্যের তালিকা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12 sm:space-y-16">

      {/* ── Section A: আজ দাম বেড়েছে ▲ ── */}
      {topRisers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-red-500 font-black text-lg leading-none select-none">▲</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">আজ দাম বেড়েছে</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {topRisers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Section B: আজ দাম কমেছে ▼ ── */}
      {topFallers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-emerald-600 font-black text-lg leading-none select-none">▼</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">আজ দাম কমেছে</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {topFallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── Section C: সব পণ্য ── */}
      <section id="সব-পণ্য" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">সব পণ্য</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              নিত্যপণ্যের বিস্তারিত বাজারদর —{" "}
              <span className="font-semibold text-gray-700">মোট {toBengaliDigits(products.length)}টি পণ্য</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 bg-white rounded-lg px-2 py-1.5 border border-gray-100 shadow-sm">
            <label className="text-sm text-gray-500 font-medium pl-1 hidden sm:block">সাজান:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="select select-bordered select-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0b7a48]/20 focus:border-[#0b7a48] cursor-pointer"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedAllProducts.map((product) => (
            <ProductCard key={`all-${product.id}`} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}