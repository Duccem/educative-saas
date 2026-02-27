"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  return (
    <header className="w-full h-16  text-white flex items-center ">
      <SidebarTrigger className="-ml-1" />
    </header>
  );
};

