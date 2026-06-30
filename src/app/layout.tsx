import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "CareerPilot AI | Multi-Agent AI Career Platform",
  description:
    "LangGraph-powered career platform for resume analysis, ATS optimization, job matching, AI cover letter generation, interview preparation, application tracking, and RAG-based career guidance.",
  icons: {
    icon: "/favicon.ico",
    // shortcut: "/favicon-32x32.png",
    // apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "CareerPilot AI",
    description:
      "Multi-Agent AI Career Platform powered by LangGraph and RAG.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerPilot AI",
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
