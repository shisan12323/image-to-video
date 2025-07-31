import Blog from "@/components/blocks/blog";
import { Blog as BlogType } from "@/types/blocks/blog";
import { getPostsByLocale } from "@/models/post";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  let canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/posts`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/posts`;
  }

  const ogImage = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}/imgs/showcases/1.webp`;
  
  return {
    title: t("blog.title"),
    description: t("blog.description"),
    keywords: 'ai image to video articles, video generation blog, ai video creation posts, image to video content',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t("blog.title"),
      description: t("blog.description"),
      url: canonicalUrl,
      images: [ogImage],
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t("blog.title"),
      description: t("blog.description"),
      images: [ogImage],
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const posts = await getPostsByLocale(locale);

  const blog: BlogType = {
    title: t("blog.title"),
    description: t("blog.description"),
    items: posts,
    read_more_text: t("blog.read_more_text"),
  };

  return (
    <>
      {/* BreadcrumbList JSON-LD for Posts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}${locale !== 'en' ? `/${locale}` : ''}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Posts",
                "item": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art'}${locale !== 'en' ? `/${locale}` : ''}/posts`
              }
            ]
          })
        }}
      />
      <Blog blog={blog} />
    </>
  );
}
