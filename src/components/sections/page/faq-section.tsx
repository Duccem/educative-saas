"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "¿Qué es Educative y cómo funciona?",
    answer:
      "Educative es una plataforma integral para instituciones educativas que centraliza la enseñanza online y la gestión académica. Permite administrar cursos, horarios, asistencia, evaluaciones y calificaciones en un solo lugar.",
  },
  {
    question: "¿A quién está dirigida la plataforma?",
    answer:
      "Está orientada a escuelas, colegios, academias y centros de formación que desean mejorar su operación académica y ofrecer una experiencia educativa digital más estructurada.",
  },
  {
    question: "¿Qué procesos académicos puedo gestionar en Educative?",
    answer:
      "Puedes gestionar períodos académicos, asignaturas, secciones, asistencia, actividades, evaluaciones y reportes de calificaciones para mantener trazabilidad completa del progreso de cada estudiante.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">
              Preguntas
              <br />
              frecuentes
            </h2>
          </div>
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-t">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="text-sm pr-4">{faq.question}</span>
                  <Plus
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-45" : ""}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="pb-5 text-sm text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t" />
          </div>
        </div>
      </div>
    </section>
  );
}

