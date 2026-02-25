import { Button } from "@/components/ui/button";

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 text-sm border rounded-full mb-6">
            Cómo funciona
          </span>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl text-balance">
            La forma más simple de
            <br />
            modernizar tu institución educativa
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Unifica la enseñanza online, la planificación académica y el
            seguimiento del desempeño estudiantil en una sola solución.
          </p>
        </div>

        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <h3 className="font-sans text-2xl md:text-3xl mb-4">
              1. Estructura tu operación académica
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Configura sedes, períodos académicos, niveles y asignaturas para
              establecer una base de trabajo ordenada desde el primer día.
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
              2. Gestiona tu comunidad educativa
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Administra docentes, estudiantes y responsables con roles
              definidos para una coordinación institucional clara y eficiente.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <h3 className="font-sans text-2xl md:text-3xl mb-4">
              3. Planifica clases con trazabilidad
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Organiza horarios, lecciones, módulos y actividades para asegurar
              continuidad pedagógica y cumplimiento del plan académico.
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
              4. Evalúa y monitorea resultados
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Registra asistencia, aplica evaluaciones y consolida
              calificaciones para respaldar decisiones académicas basadas en
              evidencia.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="text-center mb-16">
          <h3 className="font-sans text-2xl md:text-3xl mb-4">
            5. Mejora continuamente
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Visualiza indicadores de desempeño, optimiza procesos y fortalece la
            calidad educativa de forma sostenida.
          </p>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            Agendar demostración
          </Button>
        </div>
      </div>
    </section>
  );
}

