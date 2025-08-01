import Icon from "@/components/icon";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations();
  const footer = {
    brand: {
      title: t('footer.brand.title'),
      description: t('footer.brand.description'),
      logo: {
        src: "/logo.svg",
        alt: "ImageToVideo AI"
      },
      url: "/"
    },
    copyright: t('footer.copyright'),
    privacy_policy: t('footer.privacy_policy'),
    terms_of_service: t('footer.terms_of_service'),
    blog: t('footer.blog'),
    agreement: {
      items: [
        {
          title: t('footer.privacy_policy'),
          url: "/privacy-policy"
        },
        {
          title: t('footer.terms_of_service'),
          url: "/terms-of-service"
        }
      ]
    }
  };

  return (
    <section id="footer" className="py-8">
      <div className="max-w-7xl mx-auto px-8">
        <footer>
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-4 lg:items-start">
              {footer.brand && (
                <div>
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    {footer.brand.logo && footer.brand.logo.src && (
                      <Image
                        src={footer.brand.logo.src}
                        alt={footer.brand.logo.alt || footer.brand.title || "Image to Video Logo"}
                        width={40}
                        height={40}
                        className="h-10"
                        priority
                      />
                    )}
                    {footer.brand.title && (
                      <p className="text-2xl font-semibold">
                        {footer.brand.title}
                      </p>
                    )}
                  </div>
                  {footer.brand.description && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      {footer.brand.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-end">
              {/* Blog Link */}
              {process.env.NEXT_PUBLIC_SHOW_BLOG === 'true' && (
                <div className="mb-4">
                  <Link 
                    href="/blog" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    📝 {t('footer.blog') || 'Blog'}
                  </Link>
                </div>
              )}

              {footer.agreement && (
                <ul className="flex justify-center gap-6 lg:justify-end">
                  {footer.agreement.items?.map((item, i) => (
                    <li key={i} className="hover:text-primary">
                      <a href={item.url}>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Badges Section - Moved below the main footer content */}
          <div className="mt-6 border-t pt-6">
            <div className="flex flex-col gap-4 justify-center">
              {/* 已删除第三方徽标区域 */}
              {/* 已删除AI导航/工具外链区域 */}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col justify-center gap-4 border-t pt-6 text-center text-sm font-medium text-muted-foreground">
            {footer.copyright && (
              <p>
                {footer.copyright}
              </p>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}
