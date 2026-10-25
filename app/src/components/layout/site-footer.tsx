import { branchIds, legalSlugs, serviceSlugs, type SiteContent } from "@/content/data/types";
import { branchMeta, contact } from "@/content/data/site";
import { localizedHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import Link from "next/link";
import { Logo } from "./logo";

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
  content: SiteContent;
};

async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter({ locale, dict, content }: SiteFooterProps) {
  const href = (path: string) => localizedHref(locale, path);
  const { footer, nav } = dict;
  const year = await getCurrentYear();

  const companyLinks = [
    { href: href("/about"), label: nav.about },
    { href: href("/packages"), label: nav.packages },
    { href: href("/faq"), label: nav.faq },
    { href: href("/contact"), label: nav.contact },
  ];

  return (
    <footer className="mt-auto border-t border-border pt-20 pb-28 sm:pb-12">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] md:gap-8">
          <div className="max-w-xs">
            <Logo href={href("/")} label={dict.meta.siteName} />
            <p className="mt-4 text-muted-foreground">{footer.tagline}</p>
          </div>

          <FooterColumn title={footer.servicesTitle}>
            {serviceSlugs.map((slug) => (
              <li key={slug}>
                <FooterLink href={href(`/services/${slug}`)}>{content.services[slug].title}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={footer.companyTitle}>
            {companyLinks.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={footer.officesTitle}>
            {branchIds.map((id) => (
              <li key={id}>
                <span className="font-medium">{content.branches[id].name}</span>
                {branchMeta[id].phone ? (
                  <span className="block text-sm text-muted-foreground">
                    <bdi dir="ltr">{branchMeta[id].phone.display}</bdi>
                  </span>
                ) : null}
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={footer.contactTitle}>
            <li>
              <FooterLink href={`tel:${contact.phones.mobile.tel}`}>
                <bdi dir="ltr">{contact.phones.mobile.display}</bdi>
              </FooterLink>
            </li>
            <li>
              <FooterLink href={`tel:${contact.phones.office.tel}`}>
                <bdi dir="ltr">{contact.phones.office.display}</bdi>
              </FooterLink>
            </li>
            <li>
              <FooterLink href={`https://wa.me/${contact.whatsapp}`} external>
                {dict.contactFab.whatsapp}
              </FooterLink>
            </li>
          </FooterColumn>
        </div>

        <ul aria-label={footer.accreditationsLabel} className="mt-14 flex flex-wrap gap-2.5">
          {[footer.licence, footer.membership].map((item) => (
            <li
              key={item}
              className="rounded-full border border-border px-3 py-2 text-xs text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{format(footer.copyright, { year })}</p>
          <nav aria-label={footer.legalTitle}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalSlugs.map((slug) => (
                <li key={slug}>
                  <FooterLink href={href(`/legal/${slug}`)}>{dict.legal.names[slug]}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
          <ul aria-label={footer.socialLabel} className="flex gap-5">
            {(["instagram", "linkedin", "youtube"] as const).map((network) => (
              <li key={network}>
                <FooterLink href={contact.socials[network]} external>
                  {footer[network]}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-4 text-muted-foreground">{title}</h2>
      <ul className="grid gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className = "inline-flex min-h-6 items-center transition-colors hover:text-primary";
  if (external || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
