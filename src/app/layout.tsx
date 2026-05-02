import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Preloader from "@/components/Preloader";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["cyrillic", "latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "С Юбилеем, Мама!",
  description: "Вечная память и поздравления для мамы",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} ${playfair.variable} antialiased min-h-[100dvh] flex flex-col bg-transparent text-text-main pb-[72px]`}>
        <Preloader />
        <main className="flex-grow flex flex-col relative w-full h-full z-10">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
