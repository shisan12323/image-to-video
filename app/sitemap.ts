import { MetadataRoute } from 'next'
import { getAllPosts, PostStatus } from '@/models/post'
import { Post } from '@/types/post'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.image-to-video.art'
  const locales = ['en', 'zh', 'fr', 'de', 'es', 'ja', 'ko', 'ms', 'vi', 'id', 'km', 'hi']
  
  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ]

  // Add all language homepages
  locales.slice(1).forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })
  })

  // Add English pricing page
  urls.push({
    url: `${baseUrl}/pricing`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // Add all pricing pages for each language
  locales.slice(1).forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add English blog page
  urls.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // Add all blog pages for each language
  locales.slice(1).forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add English posts page
  urls.push({
    url: `${baseUrl}/posts`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // Add all posts pages for each language
  locales.slice(1).forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add video page
  urls.push({
    url: `${baseUrl}/video`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  // Add all video pages for each language
  locales.slice(1).forEach(locale => {
    urls.push({
      url: `${baseUrl}/${locale}/video`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Dynamic blog articles from database
  try {
    const allPosts = await getAllPosts(1, 1000) // Get all posts
    
    // Add English blog articles
    allPosts.forEach((post: Post) => {
      if (post.status === PostStatus.Online) {
        urls.push({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.created_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })

    // Add all language blog articles
    locales.slice(1).forEach(locale => {
      allPosts.forEach((post: Post) => {
        if (post.status === PostStatus.Online) {
          urls.push({
            url: `${baseUrl}/${locale}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at || post.created_at || new Date()),
            changeFrequency: 'monthly',
            priority: 0.5,
          })
        }
      })
    })

    // Add English posts articles
    allPosts.forEach((post: Post) => {
      if (post.status === PostStatus.Online) {
        urls.push({
          url: `${baseUrl}/posts/${post.slug}`,
          lastModified: new Date(post.updated_at || post.created_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })

    // Add all language posts articles
    locales.slice(1).forEach(locale => {
      allPosts.forEach((post: Post) => {
        if (post.status === PostStatus.Online) {
          urls.push({
            url: `${baseUrl}/${locale}/posts/${post.slug}`,
            lastModified: new Date(post.updated_at || post.created_at || new Date()),
            changeFrequency: 'monthly',
            priority: 0.5,
          })
        }
      })
    })
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  // 隐私政策和条款页面不添加到sitemap，避免被搜索引擎索引

  return urls
}