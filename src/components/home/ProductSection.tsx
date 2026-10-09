"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { getProducts, toBengaliDigits } from "@/services/bazarApi";
import ProductCard from "../products/ProductCard";

export default function ProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

      {/* ── আজ দাম বেড়েছে ▲ ── */}
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

      {/* ── আজ দাম কমেছে ▼ ── */}
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

      {/* ── সব পণ্য ── */}
      <section id="সব-পণ্য" className="scroll-mt-24">
        <div className="mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">সব পণ্য</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            নিত্যপণ্যের বিস্তারিত বাজারদর —{" "}
            <span className="font-semibold text-gray-700">মোট {toBengaliDigits(products.length)}টি পণ্য</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={`all-${product.id}`} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}