import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("page.footer");

  return (
    <footer className="py-12 px-6 bg-background border-t">
      <div className="max-w-6xl mx-auto">
        {/* Navigation links */}
        <nav className="flex flex-wrap gap-6 mb-12">
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            {t("links.institutions")}
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            {t("links.pricing")}
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            {t("links.academicResources")}
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            {t("links.institutionalCases")}
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            {t("links.about")}
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            {t("links.helpCenter")}
          </Link>
        </nav>

        {/* Copyright and legal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("legal.terms")}
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("legal.privacy")}
            </Link>
          </div>
        </div>

        {/* Large logo */}
        <div className="overflow-hidden text-center">
          <h2 className="text-[8rem] md:text-[12rem] lg:text-[16rem] tracking-tight leading-none lowercase font-serif font-light text-accent">
            Educative
          </h2>
        </div>
      </div>
    </footer>
  );
}

