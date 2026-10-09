import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { toBengaliDigits, formatCardUnit, formatBengaliPrice } from "@/services/bazarApi";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dir = product.change?.dir || "flat";
  const pct = Math.abs(product.change?.pct ?? 0);
  const formattedPct = toBengaliDigits(pct.toFixed(1)) + "%";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-emerald-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform duration-200">
            {product.image || product.categoryIcon || "🛒"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-gray-900 font-bold text-base leading-tight truncate group-hover:text-[#0b7a48] transition-colors">
              {product.nameBn}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{formatCardUnit(product.unit)}</p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-50 flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-gray-400 font-medium block mb-1">আজকের দাম</span>
            <span className="text-lg font-extrabold text-gray-900">{formatBengaliPrice(product.today)}</span>
          </div>
          {dir === "up" && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100/80 shrink-0">
              ▲ {formattedPct}
            </span>
          )}
          {dir === "down" && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/80 shrink-0">
              ▼ {formattedPct}
            </span>
          )}
          {dir === "flat" && (
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-400 border border-gray-100/80 shrink-0">
              — ০.০%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}