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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art';

  return {
    title: {
      template: `%s`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    metadataBase: new URL(baseUrl),
    openGraph: {
      siteName: 'Image to Video',
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art';

  // Structured data for the website
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Image to Video",
    "description": "Smart image to video platform that transforms your photos into stunning videos using artificial intelligence",
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
      "https://twitter.com/image_to_video",
      "https://facebook.com/image.to.video",
      "https://linkedin.com/company/image-to-video"
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
    "name": "Image to Video",
    "description": "AI-powered image to video platform that transforms your images into stunning videos using artificial intelligence",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@image-to-video.art"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Image to Video Service",
    "description": "Professional image to video generation using artificial intelligence",
    "provider": {
      "@type": "Organization",
      "name": "Image to Video"
    },
    "serviceType": "Image to Video",
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
