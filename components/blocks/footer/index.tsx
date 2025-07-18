import { Footer as FooterType } from "@/types/blocks/footer";
import Icon from "@/components/icon";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer({ footer }: { footer: FooterType }) {
  const t = useTranslations();
  
  if (footer.disabled) {
    return null;
  }

  return (
    <section id={footer.name} className="py-8">
      <div className="max-w-7xl mx-auto px-8">
        <footer>
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-4 lg:items-start">
              {footer.brand && (
                <div>
                  <div className="flex items-center justify-center gap-2 lg:justify-start">
                    {footer.brand.logo && (
                      <img
                        src={footer.brand.logo.src}
                        alt={footer.brand.logo.alt || footer.brand.title}
                        className="h-10"
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
                  {/* Badges Section */}
                  <div className="mt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <a
                      href="https://turbo0.com/item/ai-garden-design"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://img.turbo0.com/badge-listed-light.svg"
                        alt="Listed on Turbo0"
                        style={{ height: 54, width: 'auto' }}
                      />
                    </a>
                    {/* AI Nav Site link */}
                    <a
                      href="https://navs.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="AI Sites | 2025"
                      className="text-primary underline hover:text-primary/80 text-sm font-medium"
                    >
                      AI Nav Site
                    </a>
                    {/* AIStage link */}
                    <a
                      href="https://aistage.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="AIStage"
                      className="text-primary underline hover:text-primary/80 text-sm font-medium"
                    >
                      AIStage
                    </a>
                    {/* Dang.ai badge */}
                    <a
                      href="https://dang.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
                        alt="Dang.ai"
                        style={{ width: 150, height: 54 }}
                        width={150}
                        height={54}
                      />
                    </a>
                    {/* AIToolly link */}
                    <a
                      href="https://AIToolly.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="AIToolly AI Tools Directory"
                      className="text-primary underline hover:text-primary/80 text-sm font-medium"
                    >
                      AIToolly
                    </a>
                    {/* Fazier badge */}
                    <a
                      href="https://fazier.com/launches/www.aigardendesign.online"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=light"
                        alt="Fazier badge"
                        width={250}
                        style={{ width: 250 }}
                      />
                    </a>
                    {/* Twelve Tools badge */}
                    <a
                      href="https://twelve.tools"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://twelve.tools/badge0-light.svg"
                        alt="Featured on Twelve Tools"
                        width={200}
                        height={54}
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-end">
              {/* Blog Link */}
              <div className="mb-4">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  📝 {t('footer.blog') || 'Blog'}
                </Link>
              </div>

              {footer.agreement && (
                <ul className="flex justify-center gap-6 lg:justify-end">
                  {footer.agreement.items?.map((item, i) => (
                    <li key={i} className="hover:text-primary">
                      <a href={item.url} target={item.target}>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
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
