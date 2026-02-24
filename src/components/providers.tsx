"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

