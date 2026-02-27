"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import {
  BookOpen,
  ChevronRight,
  House,
  LayoutDashboardIcon,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  isActive?: boolean;
  roles: string[];
  items?: {
    title: string;
    url: string;
  }[];
};

const menuItems: MenuItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: House,
    roles: ["superadmin", "admin", "teacher", "parent", "student"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["superadmin", "admin"],
    isActive: true,
    items: [
      {
        title: "Workspace",
        url: "/settings/organization",
      },
      {
        title: "Billing",
        url: "/settings/billing",
      },
      {
        title: "Team",
        url: "/settings/team",
      },
    ],
  },
];

export function SidebarOptions() {
  const { data, isPending } = authClient.useActiveMemberRole();

  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!isPending && data) {
      const filteredItems = menuItems.filter((item) =>
        item.roles.includes(data.role as string),
      );
      setItems(filteredItems);
    }
  }, [isPending, data]);

  if (isPending) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                size="lg"
                className="cursor-not-allowed opacity-50"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  ...
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Loading...</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            render={() => (
              <SidebarMenuItem>
                {!item.items ? (
                  <SidebarMenuButton tooltip={item.title}>
                    <Link
                      href={item.url as any}
                      className="flex items-center gap-2 w-full"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      }
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              render={
                                <Link href={subItem.url as any}>
                                  <span>{subItem.title}</span>
                                </Link>
                              }
                            />
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            )}
            defaultOpen={item.isActive}
            className="group/collapsible"
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

