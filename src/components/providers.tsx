"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "sonner";
import { TooltipProvider } from "./ui/tooltip";

const queryClient = new QueryClient();

export const Providers = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <TooltipProvider>{children}</TooltipProvider>
          </QueryClientProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

