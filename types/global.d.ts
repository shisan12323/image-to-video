// 全局类型声明
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    plausible: ((...args: any[]) => void) & { q?: any[] };
    clarity: (...args: any[]) => void;
  }
}

export {};
