import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { BlogItem } from "@/types/blocks/blog";
import { Home } from "lucide-react";
import { Post } from "@/types/post";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Crumb({ post }: { post: Post }) {
  const t = useTranslations();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aigardendesign.online';

  // Generate Breadcrumb structured data
  useEffect(() => {
    const homeUrl = post.locale === "en" ? baseUrl : `${baseUrl}/${post.locale}`;
    const blogUrl = post.locale === "en" ? `${baseUrl}/posts` : `${baseUrl}/${post.locale}/posts`;
    const currentUrl = post.locale === "en" ? `${baseUrl}/posts/${post.slug}` : `${baseUrl}/${post.locale}/posts/${post.slug}`;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": homeUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": t("blog.title"),
          "item": blogUrl
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": currentUrl
        }
      ]
    };

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    script.id = 'breadcrumb-structured-data';
    
    // Remove existing Breadcrumb structured data if any
    const existingScript = document.getElementById('breadcrumb-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [post, t, baseUrl]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={post.locale === "en" ? "/" : `/${post.locale}`}>
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={post.locale === "en" ? "/posts" : `/${post.locale}/posts`}
          >
            {t("blog.title")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{post.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
