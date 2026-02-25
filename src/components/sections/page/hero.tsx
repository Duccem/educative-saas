import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("page.hero");

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0   pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            {t("title")}
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
            {t("description")}
          </p>
          <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            {t("cta")}
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <img src="/images/hero.png" alt="" className="rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

