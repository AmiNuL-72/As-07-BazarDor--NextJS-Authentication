import React, { Suspense } from "react";
import Link from "next/link";
import {
  getProducts,
  formatCardUnit,
  formatBengaliPrice,
  toBengaliDigits,
} from "@/services/bazarApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProductDetailContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === id || p.slug === id);

  if (!product) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          পণ্যটি পাওয়া যায়নি
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0b7a48] text-white rounded-lg font-medium text-sm"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const dir = product.change?.dir || "flat";
  const pct = Math.abs(product.change?.pct ?? 0);
  const formattedPct = toBengaliDigits(pct.toFixed(1)) + "%";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl shadow-2xs">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-[#0b7a48] text-xs font-semibold rounded-full mb-2">
            {product.categoryNameBn || "নিত্যপণ্য"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {product.nameBn}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {formatCardUnit(product.unit)}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-gray-400 block mb-1">আজকের দর</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {formatBengaliPrice(product.today)}
          </div>
          <div className="mt-2">
            {dir === "up" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                ▲ {formattedPct} বৃদ্ধি
              </span>
            )}
            {dir === "down" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                ▼ {formattedPct} হ্রাস
              </span>
            )}
            {dir === "flat" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-500 border border-gray-100">
                — ০.০% অপরিবর্তিত
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Price History */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {[
          { label: "আজকের দর", value: product.today },
          { label: "গতকালের দর", value: product.yesterday },
          { label: "গত সপ্তাহের দর", value: product.lastWeek },
          { label: "গত মাসের দর", value: product.lastMonth },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-2xl p-4">
            <span className="text-xs text-gray-400 block mb-1">{label}</span>
            <span className="text-lg font-bold text-gray-900">
              {formatBengaliPrice(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Markets Table */}
      {product.markets && product.markets.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            বিভিন্ন বাজারের দর
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-500 text-xs">
                  <th className="px-4 py-3 font-semibold">বাজার</th>
                  <th className="px-4 py-3 font-semibold">বিভাগ</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    সর্বনিম্ন – সর্বোচ্চ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {product.markets.map((m, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {m.market}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.division}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 text-right">
                      {toBengaliDigits(m.min)} – {toBengaliDigits(m.max)} টাকা
                    </td>
                  </tr>
                ))}
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1.5"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0b7a48] border-t-transparent mb-3" />
            <p className="text-sm text-gray-500">পণ্যের বিবরণ লোড হচ্ছে...</p>
          </div>
        }
      >
        <ProductDetailContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}
