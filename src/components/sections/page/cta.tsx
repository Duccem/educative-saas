import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
          Impulsa la transformación digital de tu institución
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Simplifica la gestión académica, fortalece la experiencia educativa y
          mejora la toma de decisiones con información centralizada.
        </p>
        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
          Agendar demostración
        </Button>
      </div>
    </section>
  );
}

