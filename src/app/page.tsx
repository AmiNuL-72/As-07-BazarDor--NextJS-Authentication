import HeroBanner from "@/components/home/HeroBanner";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen pb-16">
      {/* Banner Section */}
      <HeroBanner/>

      {/* CTA Button: #সব-পণ্য */}
      <section
        id="সব-পণ্য"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 scroll-mt-24"
      >
        
      </section>
    </div>
  );
}