import { PostStatus, findPostBySlug } from "@/models/post";

import BlogDetail from "@/components/blocks/blog-detail";
import Empty from "@/components/blocks/empty";
import { buildCanonical, buildHreflang } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = await findPostBySlug(slug, locale);

  const canonicalUrl = buildCanonical(locale, `posts/${slug}`);

  return {
    title: post?.title,
    description: post?.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildHreflang(`posts/${slug}`),
    },
    openGraph: {
      title: post?.title,
      description: post?.description,
      url: canonicalUrl,
      type: "article",
      images: post?.cover_url ? [{ url: post.cover_url, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post?.title,
      description: post?.description,
      images: post?.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function ({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await findPostBySlug(slug, locale);

  if (!post || post.status !== PostStatus.Online) {
    return <Empty message="Post not found" />;
  }

  if (!post) return null;

  // Prepare Article structured data
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.created_at || new Date().toISOString(),
    "dateModified": post.updated_at || post.created_at || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author_name || "AI Garden Design"
    },
    "image": post.cover_url ? [post.cover_url] : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <BlogDetail post={post} />
    </>
  );
}
