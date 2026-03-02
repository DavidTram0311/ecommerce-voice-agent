import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { CartProvider } from "@/components/cart/cart-context";
import { DebugGrid } from "@/components/debug-grid";
import { isDevelopment } from "@/lib/constants";
import { HeaderWithData } from "@/components/layout/header/server-wrapper";
import { SetupToolbar } from "@/components/cart/development/setup-toolbar";
import { VoiceAgent } from "@/components/voice-agent";
// import { ElevenLabsWidget } from "@/components/voice-agent/elevenlabs-widget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STS Store",
  description: "STS Store - Voice-powered shopping experience",
  generator: 'v0.app'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <SetupToolbar />
        <CartProvider>
          <NuqsAdapter>
            <HeaderWithData />
            {children}
            <VoiceAgent />
            {/* <ElevenLabsWidget /> */}
            <Toaster closeButton position="bottom-right" />
            {isDevelopment && <DebugGrid />}
          </NuqsAdapter>
        </CartProvider>
      </body>
    </html>
  );
}
