"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { BookOpen, Building, Calendar, ChevronRight, Coins, Folder, Heart, House, Layers, Users } from "lucide-react";
import Link from "next/link";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  items?: {
    title: string;
    url: string;
  }[];
};

type MenuGroup = {
  items: MenuItem[];
  title: string;
};

type MenuConfig = {
  groups: MenuGroup[];
  role: "admin" | "teacher" | "student" | "parent";
};

export function SidebarOptions() {
  const { data, isPending } = authClient.useActiveMemberRole();

  if (isPending || !data) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton size="lg" className="cursor-not-allowed opacity-50">
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

  const selectedConfig = configs.find((conf) => conf.role === data.role) ?? configs[0];
  return (
    <>
      {selectedConfig.groups.map((c, i) => (
        <SidebarGroup key={c.title + i}>
          <SidebarGroupLabel>{c.title.toUpperCase()}</SidebarGroupLabel>
          <SidebarMenu>
            {c.items.map((item) => (
              <Collapsible
                key={item.title}
                render={() => (
                  <SidebarMenuItem>
                    {!item.items ? (
                      <SidebarMenuButton tooltip={item.title}>
                        <Link href={item.url as any} className="flex items-center gap-2 w-full">
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
                className="group/collapsible"
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

const adminMenuConfig: MenuConfig = {
  role: "admin",
  groups: [
    {
      title: "Management",
      items: [
        {
          title: "Home",
          url: "/home",
          icon: House,
        },
        {
          title: "Academic terms",
          url: "/terms",
          icon: Calendar,
        },
        {
          title: "Subjects",
          url: "/subjects",
          icon: Folder,
        },
        {
          title: "Courses",
          url: "/courses",
          icon: BookOpen,
        },
        {
          title: "Grades",
          url: "/grades",
          icon: Layers,
        },
        {
          title: "Parents",
          url: "/parents",
          icon: Heart,
        },
        {
          title: "Students",
          url: "/students",
          icon: Users,
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Workspace",
          url: "/settings/organization",
          icon: Building,
        },
        {
          title: "Billing",
          url: "/settings/billing",
          icon: Coins,
        },
        {
          title: "Team",
          url: "/settings/team",
          icon: Users,
        },
      ],
    },
  ],
};

const teacherMenuConfig: MenuConfig = {
  role: "teacher",
  groups: [],
};

const parentMenuConfig: MenuConfig = {
  role: "parent",
  groups: [],
};

const studentMenuConfig: MenuConfig = {
  role: "student",
  groups: [],
};

const configs = [adminMenuConfig, teacherMenuConfig, parentMenuConfig, studentMenuConfig];

