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

export default function Crumb({ post }: { post: Post }) {
  const t = useTranslations();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.grok-imagine.pro';

  // 预先构建面包屑 JSON-LD（SSR）
  const homeUrl = post.locale === "en" ? baseUrl : `${baseUrl}/${post.locale}`;
  const blogUrl = post.locale === "en" ? `${baseUrl}/blog` : `${baseUrl}/${post.locale}/blog`;
  const currentUrl = post.locale === "en" ? `${baseUrl}/blog/${post.slug}` : `${baseUrl}/${post.locale}/blog/${post.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": homeUrl },
      { "@type": "ListItem", "position": 2, "name": t("blog.title"), "item": blogUrl },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": currentUrl }
    ]
  };

  // useEffect 注入脚本已移除

  return (
    <Breadcrumb>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={post.locale === "en" ? "/" : `/${post.locale}`}>
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={post.locale === "en" ? "/blog" : `/${post.locale}/blog`}
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
