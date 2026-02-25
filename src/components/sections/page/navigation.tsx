"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

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
            aria-label="Toggle menu"
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
              Instituciones
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              Planes
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              Centro de ayuda
            </Link>
          </div>

          {/* Logo */}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline">Iniciar sesión</Button>
            <Button>Solicitar demo</Button>
            <Button
              size={"icon"}
              onClick={() => {
                setTheme(resolvedTheme === "light" ? "dark" : "light");
              }}
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
              Instituciones
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              Planes
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              Centro de ayuda
            </Link>
            <Link
              href="/"
              className="text-sm tracking-wide text-foreground/70 hover:text-foreground smooth-transition"
            >
              Solicitar demo
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

