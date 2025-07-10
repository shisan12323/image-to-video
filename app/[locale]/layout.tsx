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

  // Construct canonical URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aigardendesign.online';
  const canonicalUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: {
      template: `%s`,
      default: t("metadata.title") || "",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': baseUrl,
        'zh': `${baseUrl}/zh`,
        'fr': `${baseUrl}/fr`,
        'de': `${baseUrl}/de`,
        'es': `${baseUrl}/es`,
        'ja': `${baseUrl}/ja`,
        'ko': `${baseUrl}/ko`,
        'ms': `${baseUrl}/ms`,
        'vi': `${baseUrl}/vi`,
        'id': `${baseUrl}/id`,
        'km': `${baseUrl}/km`,
        'hi': `${baseUrl}/hi`,
      },
    },
    openGraph: {
      url: canonicalUrl,
      siteName: 'AI Garden Design',
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aigardendesign.online';

  // Structured data for the website
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Garden Design",
    "description": "Smart garden design platform that transforms your outdoor space using artificial intelligence",
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
      "https://twitter.com/aigardendesign",
      "https://facebook.com/aigardendesign",
      "https://linkedin.com/company/aigardendesign"
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
    "name": "AI Garden Design",
    "description": "AI-powered garden design platform",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@aigardendesign.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI Garden Design Service",
    "description": "Professional garden design generation using artificial intelligence",
    "provider": {
      "@type": "Organization",
      "name": "AI Garden Design"
    },
    "serviceType": "Garden Design",
    "areaServed": "Worldwide",
    "availableLanguage": locales
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
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
