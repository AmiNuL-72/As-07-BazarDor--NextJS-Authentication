"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product, Category } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, getCategories, toBengaliDigits } from "@/services/bazarApi";

type SortOption = "default" | "price-asc" | "price-desc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="mt-5 pt-3 border-t border-gray-50 flex items-end justify-between">
        <div className="space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded w-16" />
          <div className="h-5 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-7 bg-gray-100 rounded-md w-16" />
      </div>
    </div>
  );
}

function CategoryContent({ params }: PageProps) {
  const { slug } = use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [allProducts, allCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        const cat = allCategories.find(
          (c) => c.slug === slug || c.id === slug
        );

        if (!cat) {
          // Invalid slug → show 404
          setIsNotFound(true);
          return;
        }

        setCategory(cat);
        const filtered = allProducts.filter(
          (p) => p.category === slug || p.category === cat.id
        );
        setProducts(filtered);
        // If category exists but has no products, still show the page (empty state)
      } catch (err) {
        console.error(err);
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  // Sort
  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.today - b.today;
    if (sortBy === "price-desc") return b.today - a.today;
    return 0;
  });

  if (!isLoading && isNotFound) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">

      {/* ── Category Header Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs px-6 py-5 mb-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-2xs shrink-0">
          {isLoading ? "⌛" : category?.icon || "🛒"}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            {isLoading ? (
              <span className="inline-block h-7 w-24 bg-gray-100 rounded animate-pulse" />
            ) : (
              category?.nameBn || slug
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? (
              <span className="inline-block h-4 w-48 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
              <>
                {toBengaliDigits(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
              </>
            )}
          </p>
        </div>
      </div>

      {/* ── Sort Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs px-5 py-3.5 mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {!isLoading && (
            <>মোট <span className="font-semibold text-gray-700">{toBengaliDigits(sorted.length)}টি পণ্য</span> দেখানো হচ্ছে</>
          )}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-sm text-gray-500 font-medium hidden sm:block">সাজান:</label>
          <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="select select-bordered select-sm
            !bg-white !text-gray-800
            border-gray-300
            focus:outline-none focus:ring-2
            focus:ring-[#0b7a48]/20
            focus:border-[#0b7a48]
            cursor-pointer"
        >
          <option value="default">ডিফল্ট</option>
          <option value="price-asc">দাম: কম থেকে বেশি</option>
          <option value="price-desc">দাম: বেশি থেকে কম</option>
        </select>
        </div>
      </div>

      {/* ── Product Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 text-base font-medium">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b7a48] text-white font-semibold rounded-lg text-sm hover:bg-[#08683c] transition-all"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: PageProps) {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs px-6 py-5 mb-5 flex items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-48 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-gray-50 flex items-end justify-between">
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-gray-100 rounded w-16" />
                    <div className="h-5 bg-gray-100 rounded w-24" />
                  </div>
                  <div className="h-7 bg-gray-100 rounded-md w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <CategoryContent params={params} />
    </React.Suspense>
  );
}