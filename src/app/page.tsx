import React, { Suspense } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import ProductSections from "@/components/home/ProductSection";


export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      {/* Hero / Banner */}
      <HeroBanner />

      {/* Product Sections */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#0b7a48] border-t-transparent mb-3" />
            <p className="text-sm text-gray-500 font-medium">
              পণ্যের তালিকা লোড হচ্ছে...
            </p>
          </div>
        }
      >
        <ProductSections/>
      </Suspense>
    </div>
  );
}