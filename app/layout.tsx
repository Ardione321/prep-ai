import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/layout/footer/Footer";
import Navbar from "@/components/layout/header/Navbar";
import HeaderAccouncement from "@/components/layout/header/HeaderAccouncement";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prep AI",
  description: "Your Shortcut to Interview Success",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-right" reverseOrder={false} />
        <Providers
          themeProps={{
            defaultTheme: "dark",
            attribute: "class",
          }}
        >
          <HeaderAccouncement />
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
