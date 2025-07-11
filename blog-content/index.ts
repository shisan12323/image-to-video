// Blog content index for the hybrid architecture
// This file helps organize and manage all blog content components

export interface BlogMetadata {
  slug: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  date: string;
  readTime: {
    en: string;
    zh: string;
  };
  keywords: {
    en: string[];
    zh: string[];
  };
}

export const blogPosts: BlogMetadata[] = [
  {
    slug: "best-ai-garden-design-tools-2025",
    title: {
      en: "The Best AI Garden Design Tools in 2025",
      zh: "2025年最佳AI花园设计工具"
    },
    description: {
      en: "Transform your outdoor space with artificial intelligence. Discover the best free AI garden design tools with professional designs in 2 minutes.",
      zh: "用人工智能改造您的户外空间。发现最佳免费AI花园设计工具，专业设计只需2分钟。"
    },
    date: "2025-07-11",
    readTime: {
      en: "8 minutes",
      zh: "8分钟"
    },
    keywords: {
      en: ["ai garden design free", "ai landscape generator", "garden planner", "AI garden designer", "free garden design tools"],
      zh: ["AI花园设计", "免费花园设计工具", "人工智能景观设计", "花园规划", "AI花园设计师"]
    }
  }
];

// Helper function to get blog post metadata by slug
export function getBlogMetadata(slug: string): BlogMetadata | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Helper function to get all blog posts
export function getAllBlogPosts(): BlogMetadata[] {
  return blogPosts;
}

// Helper function to get blog post content component dynamically
export async function getBlogContent(slug: string, locale: string = 'en') {
  try {
    switch (slug) {
      case "best-ai-garden-design-tools-2025":
        if (locale === 'zh') {
          const { default: BlogContentZH } = await import('./best-ai-garden-design-tools-2025/zh');
          return BlogContentZH;
        } else {
          const { default: BlogContentEN } = await import('./best-ai-garden-design-tools-2025/en');
          return BlogContentEN;
        }
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error loading blog content for ${slug}:`, error);
    return null;
  }
}