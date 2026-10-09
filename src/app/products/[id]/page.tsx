import React, { Suspense } from "react";
import Link from "next/link";
import { getProducts, formatCardUnit, formatBengaliPrice, toBengaliDigits } from "@/services/bazarApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProductDetail({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === id || p.slug === id);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">পণ্যটি পাওয়া যায়নি</h2>
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b7a48] text-white rounded-lg font-semibold text-sm">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const dir = product.change?.dir || "flat";
  const pct = Math.abs(product.change?.pct ?? 0);
  const formattedPct = toBengaliDigits(pct.toFixed(1)) + "%";

  // Compute price summary from markets
  const markets = product.markets || [];
  const allMins = markets.map((m) => m.min);
  const allMaxs = markets.map((m) => m.max);
  const minPrice = allMins.length > 0 ? Math.min(...allMins) : product.today;
  const maxPrice = allMaxs.length > 0 ? Math.max(...allMaxs) : product.today;
  const avgPrice = markets.length > 0
    ? Math.round(markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / markets.length)
    : product.today;

  // Sort markets by avg price ascending
  const sortedMarkets = [...markets].sort((a, b) => (a.min + a.max) / 2 - (b.min + b.max) / 2);

  // Yesterday diff
  const diff = product.today - product.yesterday;
  const diffBn = (diff >= 0 ? "বেড়েছে +" : "কমেছে ") + toBengaliDigits(Math.abs(diff));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-800 transition-colors">হোম</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-500">{product.categoryNameBn}</span>
        <span className="text-gray-300">›</span>
        <span className="text-gray-800 font-medium">{product.nameBn}</span>
      </nav>

      {/* ── TOP SUMMARY CARD ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          {/* Left: Emoji + Title + Meta */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-2xs">
              {product.image || product.categoryIcon || "🛒"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.nameBn}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {formatCardUnit(product.unit)} · {product.categoryNameBn}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                গতকালের তুলনায় আজ দাম{" "}
                <span className={diff >= 0 ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"}>
                  {diffBn} টাকা
                </span>
              </p>
              {/* Category Tag */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-[#0b7a48] border border-emerald-100">
                  {product.categoryNameBn}
                </span>
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                  {formatCardUnit(product.unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Today's Price Box */}
          <div className="shrink-0 bg-gray-50 border border-gray-100 rounded-xl px-6 py-5 text-center min-w-[130px]">
            <p className="text-xs text-gray-400 font-medium mb-1">আজকের দাম</p>
            <p className="text-3xl font-extrabold text-gray-900 leading-none">
              {toBengaliDigits(product.today)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{formatCardUnit(product.unit)}</p>
            <div className="mt-2">
              {dir === "up" && (
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-500">
                  ▲ {formattedPct}
                </span>
              )}
              {dir === "down" && (
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                  ▼ {formattedPct}
                </span>
              )}
              {dir === "flat" && (
                <span className="text-xs font-bold text-gray-400">— ০.০%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRICE SUMMARY SECTION ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Min Price */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
            <p className="text-xs text-gray-400 font-medium mb-2">সর্বনিম্ন দাম</p>
            <p className="text-2xl font-extrabold text-emerald-600">{formatBengaliPrice(minPrice)}</p>
            <p className="text-xs text-gray-400 mt-2">সবচেয়ে কম দামের বাজার</p>
          </div>
          {/* Max Price */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
            <p className="text-xs text-gray-400 font-medium mb-2">সর্বাধিক দাম</p>
            <p className="text-2xl font-extrabold text-red-500">{formatBengaliPrice(maxPrice)}</p>
            <p className="text-xs text-gray-400 mt-2">সবচেয়ে বেশি দামের বাজার</p>
          </div>
          {/* Avg Price */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
            <p className="text-xs text-gray-400 font-medium mb-2">গড় দাম</p>
            <p className="text-2xl font-extrabold text-gray-900">{formatBengaliPrice(avgPrice)}</p>
            <p className="text-xs text-gray-400 mt-2">{formatCardUnit(product.unit)}-এর হিসাবে</p>
          </div>
        </div>
      </div>

      {/* ── MARKET-WISE TABLE ── */}
      {sortedMarkets.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-3 text-xs text-gray-400 font-semibold">বাজার</th>
                  <th className="text-left pb-3 text-xs text-gray-400 font-semibold">বিভাগ</th>
                  <th className="text-right pb-3 text-xs text-gray-400 font-semibold">সর্বনিম্ন</th>
                  <th className="text-right pb-3 text-xs text-gray-400 font-semibold">সর্বাধিক</th>
                  <th className="text-right pb-3 text-xs text-gray-400 font-semibold">গড়</th>
                </tr>
              </thead>
              <tbody>
                {sortedMarkets.map((m, idx) => {
                  const rowAvg = (m.min + m.max) / 2;
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx === 0 ? "bg-emerald-50/30" : ""}`}
                    >
                      <td className="py-3.5 pr-4">
                        <span className="font-semibold text-gray-900">{m.market}</span>
                        {idx === 0 && (
                          <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            সবচেয়ে কম
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-gray-500">{m.division}</td>
                      <td className="py-3.5 pr-4 text-right text-gray-700 font-medium">
                        {toBengaliDigits(m.min)} টাকা
                      </td>
                      <td className="py-3.5 pr-4 text-right text-gray-700 font-medium">
                        {toBengaliDigits(m.max)} টাকা
                      </td>
                      <td className="py-3.5 text-right font-bold text-gray-900">
                        {toBengaliDigits(rowAvg % 1 === 0 ? rowAvg : rowAvg.toFixed(1))} টাকা
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-[#0b7a48] border-t-transparent mb-4" />
          <p className="text-sm text-gray-500">পণ্যের বিবরণ লোড হচ্ছে...</p>
        </div>
      }
    >
      <ProductDetail paramsPromise={params} />
    </Suspense>
  );
}