"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import type * as React from "react";
import { OrganizationSwitcher } from "./organization-switcher";
import { SidebarOptions } from "./sidebar-options";
import { SidebarUser } from "./sidebar-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <OrganizationSwitcher />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarOptions />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

