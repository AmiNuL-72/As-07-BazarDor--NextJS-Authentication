import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "react-hot-toast";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-bengali",
});

export const metadata: Metadata = {
  title: "বাজার দর - নিত্যপণ্যের বাজারদর ও বিশ্লেষণ",
  description: "প্রতিদিনের নিত্যপ্রয়োজনীয় পণ্যের সঠিক বাজারদর জানুন",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${notoSerifBengali.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f8faf8] text-gray-900 font-sans">
        <Toaster position="top-center" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}