'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Google Analytics 配置
const GA_TRACKING_ID = 'G-1X6V67LRCW';
const PLAUSIBLE_DOMAIN = 'image-to-video.art';
const CLARITY_ID = 'sczpcuda6b';

export function GoogleAnalytics() {
  useEffect(() => {
    // 确保在客户端环境下初始化
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          // 初始化 Google Analytics
          if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
              window.dataLayer.push(arguments);
            }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', GA_TRACKING_ID, {
              page_title: document.title,
              page_location: window.location.href,
            });
          }
        }}
      />
    </>
  );
}

export function PlausibleAnalytics() {
  return (
    <Script
      src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
      data-domain={PLAUSIBLE_DOMAIN}
      strategy="lazyOnload"
      onLoad={() => {
        // 初始化 Plausible 函数
        if (typeof window !== 'undefined') {
          window.plausible = window.plausible || function(...args: any[]) { 
            (window.plausible.q = window.plausible.q || []).push(args) 
          };
        }
      }}
    />
  );
}

export function MicrosoftClarity() {
  return (
    <Script id="clarity-init" strategy="lazyOnload">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}

// 组合所有分析脚本
export function Analytics() {
  useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            console.log('FID detected');
          }
          if (entry.entryType === 'layout-shift') {
            console.log('CLS detected');
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      
      return () => observer.disconnect();
    }
  }, []);

  return (
    <>
      <GoogleAnalytics />
      <PlausibleAnalytics />
      <MicrosoftClarity />
    </>
  );
}
