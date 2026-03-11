import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jesko Jets — Redefining the Skies",
  description:
    "Experience the pinnacle of private aviation. Jesko Jets delivers unparalleled luxury, performance, and global connectivity.",
  openGraph: {
    title: "Jesko Jets — Redefining the Skies",
    description:
      "Experience the pinnacle of private aviation. Jesko Jets delivers unparalleled luxury, performance, and global connectivity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
