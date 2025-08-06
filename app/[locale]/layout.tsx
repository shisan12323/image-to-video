export const runtime = "edge";

import "@/app/globals.css";

import { getMessages, getTranslations } from "next-intl/server";

import { AppContextProvider } from "@/contexts/app";
import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import { cn } from "@/lib/utils";
import { locales } from "@/i18n/locale";
import { Analytics } from "@/components/analytics";
import Script from "next/script";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();

  // Base URL for metadata
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro';

  return {
    title: {
      template: `%s`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    metadataBase: new URL(baseUrl),
    openGraph: {
      siteName: 'Grok Imagine',
      locale: locale,
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  // Base URL for structured data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro';

  // Structured data for the website
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Grok Imagine",
    "description": "AI-powered video and image platform that transforms your ideas into viral content using Aurora engine technology",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/grokimagine",
      "https://facebook.com/grokimagine",
      "https://linkedin.com/company/grokimagine"
    ],
    "inLanguage": locales.map(lang => ({
      "@type": "Language",
      "name": lang === 'en' ? 'English' : lang,
      "alternateName": lang
    }))
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Grok Imagine",
    "description": "AI-powered video and image platform that transforms your ideas into viral content using Aurora engine technology",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@grok-imagine.pro"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Grok Imagine Service",
    "description": "Professional video and image generation using artificial intelligence",
    "provider": {
      "@type": "Organization",
      "name": "Grok Imagine"
    },
    "serviceType": "Grok Imagine",
    "areaServed": "Worldwide",
    "availableLanguage": locales
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/hero-background.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/imgs/showcases/1.webp" as="image" type="image/webp" />
        
        {/* Analytics Scripts - Optimized Loading */}
        <Analytics />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceData)
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider>
            <AppContextProvider>
              <ThemeProvider attribute="class" disableTransitionOnChange>
                {children}
              </ThemeProvider>
            </AppContextProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
