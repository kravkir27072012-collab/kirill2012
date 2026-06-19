import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { ChatSearch } from "@/components/chat/ChatSearch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "KrossKZ — поиск лучших кроссовок по маркетплейсам Казахстана",
  description:
    "Сравниваем цену, рейтинг, отзывы и риск подделки на Kaspi, Technodom, Mechta, Wildberries и Ozon — и находим лучший вариант.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <ChatSearch />
        </ThemeProvider>
      </body>
    </html>
  );
}
