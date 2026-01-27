import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React from "react";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getDictionary } from "@/get-dictionary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TelecomBGLabs - Best Internet & Mobile Plans in Bulgaria",
  description: "Find the best home internet, TV, and mobile plans in your area. Compare offers from top providers efficiently.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

import { AnalyticsProvider } from "@/lib/analytics";

// ...

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = (await getDictionary(lang as any)) as any;

  return (
    <html lang={lang}>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50`}
      >
        <AnalyticsProvider />
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                TelecomBG<span className="text-primary-600">Labs</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 items-center">
              <Link href={`/${lang}/internet`} className="hover:text-primary-600 transition-colors">
                {dict.navigation.internet}
              </Link>
              <Link href={`/${lang}#how-it-works`} className="hover:text-primary-600 transition-colors">
                {dict.navigation.howItWorks}
              </Link>
              <Link href={`/${lang}#faq`} className="hover:text-primary-600 transition-colors">
                {dict.navigation.faq}
              </Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSwitcher />

            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
              <div className="md:col-span-1">
                <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                    T
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    TelecomBG<span className="text-primary-600">Labs</span>
                  </span>
                </Link>
                <p className="text-sm text-slate-500 max-w-sm">
                  {dict.footer.disclaimer}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">{dict.footer.services}</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href={`/${lang}/internet`} className="hover:text-primary-600">{dict.footer.links.internet}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">{dict.navigation.about}</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href={`/${lang}/about`} className="hover:text-primary-600">{dict.footer.links.about}</Link></li>
                  <li><Link href={`/${lang}/contact`} className="hover:text-primary-600">{dict.footer.links.contact}</Link></li>
                  <li><Link href={`/${lang}/business`} className="hover:text-primary-600">{dict.navigation.business}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">{dict.footer.links.privacy}</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li><Link href={`/${lang}/privacy`} className="hover:text-primary-600">{dict.footer.links.privacy}</Link></li>
                  <li><Link href={`/${lang}/terms`} className="hover:text-primary-600">{dict.footer.links.terms}</Link></li>
                  <li><Link href={`/${lang}/cookies`} className="hover:text-primary-600">{dict.footer.links.cookies}</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
              <p>{dict.footer.copyright}</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
