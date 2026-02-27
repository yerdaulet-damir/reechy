import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Reechy | Record a Pitch Video in 60 Seconds",
  description: "The fastest way to record, edit, and share pitch videos. Built-in teleprompter, in-browser trimming, and instant Calendly booking pages. The ultimate open-source Loom alternative.",
  keywords: "pitch video, record pitch, teleprompter app, loom alternative, capcut alternative, sales video, instant booking page, open source video recorder",
  openGraph: {
    title: "Reechy | Fast Pitch Videos",
    description: "The ultimate open-source Loom alternative for founders and sales teams.",
    url: "https://reechy.live", 
    siteName: "Reechy",
    images: [{ url: "/docs/cover-image.gif", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reechy | Fast Pitch Videos",
    description: "The ultimate open-source Loom alternative.",
    images: ["/docs/cover-image.gif"],
  },
  authors: [{ name: "Yerdaulet" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
