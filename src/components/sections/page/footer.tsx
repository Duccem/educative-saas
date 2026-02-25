import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-background border-t">
      <div className="max-w-6xl mx-auto">
        {/* Navigation links */}
        <nav className="flex flex-wrap gap-6 mb-12">
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            Instituciones
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            Planes
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            Recursos académicos
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            Casos institucionales
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            Nosotros
          </Link>
          <Link
            href="#"
            className="text-sm hover:text-muted-foreground transition-colors"
          >
            Centro de ayuda
          </Link>
        </nav>

        {/* Copyright and legal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <p className="text-sm text-muted-foreground">
            © 2026 Educative. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Términos del servicio
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Política de privacidad
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

