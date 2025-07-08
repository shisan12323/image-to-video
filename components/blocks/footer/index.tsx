import { Footer as FooterType } from "@/types/blocks/footer";
import Icon from "@/components/icon";

export default function Footer({ footer }: { footer: FooterType }) {
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
                </div>
              )}
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
