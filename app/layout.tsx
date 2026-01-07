import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TAXPAIN - Nigerian Tax Calculator & Exemption Checker",
  description:
    "Free Nigerian tax calculator for individuals and businesses. Calculate your tax obligations under the 2025 Tax Reform Acts. No signup required.",
  keywords: [
    "Nigeria tax calculator",
    "Nigerian tax",
    "tax exemption",
    "PIT calculator",
    "CIT calculator",
    "Nigeria Tax Act 2025",
  ],
  authors: [{ name: "TAXPAIN" }],
  openGraph: {
    title: "TAXPAIN - Nigerian Tax Calculator",
    description:
      "Know your tax position in 60 seconds. Free calculator for Nigeria Tax Act 2025.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TAXPAIN - Nigerian Tax Calculator",
    description: "Free Nigerian tax calculator for individuals and businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

