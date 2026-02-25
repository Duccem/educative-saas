import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("page.howItWorks");

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 text-sm border rounded-full mb-6">
            {t("badge")}
          </span>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl text-balance">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <h3 className="font-sans text-2xl md:text-3xl mb-4">
              {t("steps.1.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("steps.1.description")}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img src="/images/how-1.png" alt="" className="rounded-3xl" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <img src="/images/how-2.png" alt="" className="rounded-3xl" />
          </div>
          <div>
            <h3 className="font-sans text-2xl md:text-3xl mb-4">
              {t("steps.2.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("steps.2.description")}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <h3 className="font-sans text-2xl md:text-3xl mb-4">
              {t("steps.3.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("steps.3.description")}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img src="/images/how-3.png" alt="" className="rounded-3xl" />
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <img src="/images/how-4.png" alt="" className="rounded-3xl" />
          </div>
          <div>
            <h3 className="font-sans text-2xl md:text-3xl mb-4">
              {t("steps.4.title")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("steps.4.description")}
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="text-center mb-16">
          <h3 className="font-sans text-2xl md:text-3xl mb-4">
            {t("step5.title")}
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            {t("step5.description")}
          </p>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            {t("step5.cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}

