import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic Metadata
  title: "Reechy | Record a Pitch Video in 60 Seconds",
  description: "The fastest way to record, edit, and share pitch videos. Built-in teleprompter, in-browser trimming, and instant Calendly booking pages. The ultimate open-source Loom alternative.",
  keywords: "pitch video, record pitch, teleprompter app, loom alternative, capcut alternative, sales video, instant booking page, open source video recorder",
  authors: [{ name: "Yerdaulet" }],
  creator: "Yerdaulet",
  publisher: "Reechy",

  // Icons & Manifest
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
  },
  manifest: "/manifest.json",

  // Open Graph
  openGraph: {
    title: "Reechy | Fast Pitch Videos",
    description: "The ultimate open-source Loom alternative for founders and sales teams.",
    url: "https://reechy.cam",
    siteName: "Reechy",
    images: [{ url: "/og-images/og-image-default.png", width: 1200, height: 630, alt: "Reechy - Record Pitch Videos in 60 Seconds" }],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Reechy | Fast Pitch Videos",
    description: "The ultimate open-source Loom alternative.",
    images: ["/og-images/twitter-image.png"],
  },

  // SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },

  // Verification (placeholders for future)
  verification: {
    google: "", // Add Google Search Console verification when available
    yandex: "",
  },

  // Alternates
  alternates: {
    canonical: "https://reechy.cam",
  },

  // Category
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
