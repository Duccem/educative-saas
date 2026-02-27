import { Header } from "@/components/sections/layout/header";
import { AppSidebar } from "@/components/sections/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-col px-6 ">
          <Header />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

