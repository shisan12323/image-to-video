"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import Crumb from "./crumb";
import Markdown from "@/components/markdown";
import { Post } from "@/types/post";
import moment from "moment";

export default function BlogDetail({ post }: { post: Post }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.image-to-video.art';

  // 预先构建 Article 结构化数据（SSR）
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description || post.title,
    "image": post.cover_url ? `${baseUrl}${post.cover_url}` : `${baseUrl}/og-image.jpg`,
    "author": {
      "@type": "Person",
      "name": post.author_name || "Image to Video Team",
      "image": post.author_avatar_url
    },
    "publisher": {
      "@type": "Organization",
      "name": "Image to Video",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.svg`
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    "articleSection": "Image to Video",
    "keywords": "image to video, AI video generation, video from image, AI video, image animation"
  };

  return (
    <section className="py-16">
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container">
        <Crumb post={post} />
        <h1 className="mb-7 mt-9 max-w-3xl text-2xl font-bold md:mb-10 md:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm md:text-base">
          {post.author_avatar_url && (
            <Avatar className="h-8 w-8 border">
              <AvatarImage
                src={post.author_avatar_url}
                alt={post.author_name}
              />
            </Avatar>
          )}
          <div>
            {post.author_name && (
              <span className="font-medium">{post.author_name}</span>
            )}

            <span className="ml-2 text-muted-foreground">
              on {post.created_at && moment(post.created_at).fromNow()}
            </span>
          </div>
        </div>
        <div className="relative py-8 grid max-w-screen-xl gap-4 lg:mt-0 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="order-2 lg:order-none lg:col-span-8">
            {post.content && <Markdown content={post.content} />}
          </div>
          <div className="order-1 flex h-fit flex-col text-sm lg:sticky lg:top-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs"></div>
        </div>
      </div>
    </section>
  );
}
