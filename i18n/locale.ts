import { Pathnames } from "next-intl/routing";

export const locales = ["en", "es"];

export const localeNames: any = {
  en: "English",
  es: "Español"
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames = {
  "/": "/",
  "/blog": "/blog",
  "/blog/[slug]": "/blog/[slug]",
  "/pricing": "/pricing",
  "/video": "/video",
  "/posts": "/posts",
  "/posts/[slug]": "/posts/[slug]",
  "/i/[code]": "/i/[code]",
  "/my-credits": "/my-credits",
  "/my-images": "/my-images",
  "/my-orders": "/my-orders",
  "/admin": "/admin",
  "/admin/posts": "/admin/posts",
  "/admin/posts/add": "/admin/posts/add",
  "/admin/posts/[uuid]/edit": "/admin/posts/[uuid]/edit",
  "/admin/users": "/admin/users",
  "/admin/feedbacks": "/admin/feedbacks",
  "/admin/paid-orders": "/admin/paid-orders",
  "/admin/fix-credits": "/admin/fix-credits",
  "/pay-success/[session_id]": "/pay-success/[session_id]",
  "/auth/signin": "/auth/signin",
  "/privacy-policy": "/privacy-policy",
  "/terms-of-service": "/terms-of-service",
} satisfies Pathnames<typeof locales>;
