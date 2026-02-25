import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0   pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            Una plataforma integral para la gestión escolar
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
            Fortalece la educación online y optimiza la operación académica con
            control de horarios, asistencia, evaluaciones y calificaciones en un
            solo entorno.
          </p>
          <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            Solicitar una demostración
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <img src="/images/hero.png" alt="" className="rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

