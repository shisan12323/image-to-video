'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error occurred:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
          <div className="text-center px-6 py-12 max-w-md mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
              <p className="text-slate-600 mb-8">
                We encountered a critical error. Please try again.
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={reset} className="w-full">
                Try again
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 