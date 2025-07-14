"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";

import Crumb from "./crumb";
import Markdown from "@/components/markdown";
import { Post } from "@/types/post";
import moment from "moment";

export default function BlogDetail({ post }: { post: Post }) {
  // Generate Article structured data
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.aigardendesign.online';
    
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.description || post.title,
      "image": post.image_url ? `${baseUrl}${post.image_url}` : `${baseUrl}/og-image.jpg`,
      "author": {
        "@type": "Person",
        "name": post.author_name || "AI Garden Design Team",
        "image": post.author_avatar_url
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Garden Design",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "datePublished": post.created_at,
      "dateModified": post.updated_at || post.created_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/posts/${post.slug}`
      },
      "articleSection": "Garden Design",
      "keywords": "garden design, AI landscape, outdoor planning, garden planner"
    };

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(articleSchema);
    script.id = 'article-structured-data';
    
    // Remove existing Article structured data if any
    const existingScript = document.getElementById('article-structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('article-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [post]);

  return (
    <section className="py-16">
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
