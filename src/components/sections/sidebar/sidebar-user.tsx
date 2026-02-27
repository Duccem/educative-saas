"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import {
  BadgeCheck,
  ChevronsUpDown,
  Coins,
  LogOut,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SidebarUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const { data: role } = authClient.useActiveMemberRole();
  const router = useRouter();

  if (isPending || !session) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="cursor-not-allowed opacity-50"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
              <span className="truncate text-xs">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const logOut = async () => {
    await authClient.signOut();
    router.replace("/sign-in" as any);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg"
              >
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage
                    src={session?.user.image ?? ""}
                    alt={session?.user.name}
                    className="object-contain"
                  />
                  <AvatarFallback className="rounded-md">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={session?.user.image ?? ""}
                      alt={session?.user.name}
                      className="object-contain"
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session?.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  href={"/profile" as any}
                  className="flex items-center w-full gap-2"
                >
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              {["doctor", "owner"].includes(role?.role!) && (
                <DropdownMenuItem>
                  <Link
                    href={"/profile/professional" as any}
                    className="flex items-center w-full gap-2"
                  >
                    <Stethoscope />
                    Doctor Profile
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

