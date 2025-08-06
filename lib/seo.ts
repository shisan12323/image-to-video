export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.grok-imagine.pro";

import { locales } from "@/i18n/locale";

/**
 * Build the full canonical URL for a given locale and path.
 * @param locale       Current locale, e.g. 'en'
 * @param pathname     Path part beginning with '/', e.g. '/pricing'. Default '' for root.
 */
export function buildCanonical(locale: string, pathname: string = ""): string {
  const cleanPath = pathname.replace(/^\//, "");
  let url = BASE_URL;
  if (locale !== "en") url += `/${locale}`;
  if (cleanPath) url += `/${cleanPath}`;
  return url;
}

/**
 * Build the alternates.languages object for next Metadata based on all locales.
 * @param pathname Path part beginning with '/'
 */
export function buildHreflang(pathname: string = ""): Record<string, string> {
  const cleanPath = pathname.replace(/^\//, "");
  const langs: Record<string, string> = {};
  
  // Add x-default pointing to English version
  langs["x-default"] = cleanPath ? `${BASE_URL}/${cleanPath}` : BASE_URL;
  
  locales.forEach((lg) => {
    if (lg === "en") {
      langs[lg] = cleanPath ? `${BASE_URL}/${cleanPath}` : BASE_URL;
    } else {
      langs[lg] = cleanPath ? `${BASE_URL}/${lg}/${cleanPath}` : `${BASE_URL}/${lg}`;
    }
  });
  return langs;
} 