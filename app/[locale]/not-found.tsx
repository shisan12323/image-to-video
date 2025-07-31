'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.image-to-video.art/404',
  },
}

export default function NotFound() {
  return (
    <>
      {/* Noindex meta tag for 404 page */}
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center px-6 py-12 max-w-md mx-auto">
          <div className="mb-8">
            <div className="text-8xl font-bold text-slate-300 mb-4">404</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
            <p className="text-slate-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full">
                Go home
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}