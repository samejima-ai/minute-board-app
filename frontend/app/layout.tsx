import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Zen_Kurenaido, Yomogi } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Base fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
});

// Handwriting font for V2 UI (Whiteboard)
const zenKurenaido = Zen_Kurenaido({
  variable: "--font-zen-kurenaido",
  weight: "400",
  subsets: ["latin"],
});

// Chalk font for V2 UI (Blackboard)
const yomogi = Yomogi({
  variable: "--font-yomogi",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meeting Secretary",
  description: "AI-powered voice memo organizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansJP.variable} ${zenKurenaido.variable} ${yomogi.variable} antialiased font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
