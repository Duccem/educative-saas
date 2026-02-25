import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Cta() {
  const t = useTranslations("page.cta");

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
          {t("title")}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t("description")}
        </p>
        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
          {t("cta")}
        </Button>
      </div>
    </section>
  );
}

