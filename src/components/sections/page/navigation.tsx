"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { type AppLocale } from "@/lib/translation/routing";

export function Header() {
  const t = useTranslations("page.navigation");
  const locale = useLocale();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const handleLocaleChange = (nextLocale: AppLocale) => {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  };

  const toggleLocale = () => {
    const nextLocale: AppLocale = locale === "es" ? "en" : "es";
    handleLocaleChange(nextLocale);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={cn(
          "max-w-7xl mx-auto px-6 lg:px-8  rounded-lg py-0 my-0 ",
          isScrolled
            ? "bg-background/80 backdrop-blur-sm shadow-md"
            : "bg-transparent",
        )}
      >
        <div className="flex items-center justify-between h-[68px]">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground/80 hover:text-foreground smooth-transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t("aria.toggleMenu")}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link href="/" className=" flex flex-col items-center gap-0">
            <h1 className="font-sans text-2xl tracking-wider text-foreground">
              Educative
            </h1>
          </Link>

          {/* Desktop Navigation - Left */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("links.institutions")}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("links.pricing")}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("links.helpCenter")}
            </Link>
          </div>

          {/* Logo */}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline">{t("actions.signIn")}</Button>
            <Button>{t("actions.requestDemo")}</Button>
            <Button
              size={"icon"}
              onClick={toggleLocale}
              aria-label={t("aria.toggleLanguage")}
            >
              <Languages className="size-4" />
            </Button>
            <Button
              size={"icon"}
              onClick={() => {
                setTheme(resolvedTheme === "light" ? "dark" : "light");
              }}
              aria-label={t("aria.toggleTheme")}
            >
              <Sun className="dark:hidden" />
              <Moon className="hidden dark:block" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden smooth-transition ${
            isMenuOpen ? "max-h-64 pb-6" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
            <Link
              href="/products"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("links.institutions")}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("links.pricing")}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("links.helpCenter")}
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              {t("actions.requestDemo")}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

