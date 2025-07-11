import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.aigardendesign.online'
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

  // Blog articles - English versions
  const blogArticles = [
    'best-ai-garden-design-tools-2025'
  ]

  blogArticles.forEach(article => {
    urls.push({
      url: `${baseUrl}/blog/${article}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  // Blog articles - all language versions
  locales.slice(1).forEach(locale => {
    blogArticles.forEach(article => {
      urls.push({
        url: `${baseUrl}/${locale}/blog/${article}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    })
  })

  // 隐私政策和条款页面不添加到sitemap，避免被搜索引擎索引

  return urls
}