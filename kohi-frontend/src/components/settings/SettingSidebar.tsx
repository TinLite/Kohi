import { KeyRound, Settings, UserPen } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, NavLink, useLocation } from "react-router-dom";

const groups = [
  {
    title: undefined,
    items: [
      {
        title: "Public profile",
        // url: "/settings",
        url: "#",
        icon: UserPen,
        disabled: true,
      },
      {
        title: "Account",
        url: "#",
        // url: "/settings/account",
        icon: Settings,
        disabled: true,
      },
      {
        title: "Password",
        url: "/settings/password",
        icon: KeyRound,
      },
    ],
  },
  {
    title: "Application settings",
    items: [
      {
        title: "General",
        url: "/settings/app",
        icon: Settings,
      },
    ],
  },
];

export function SettingSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="px-2">Settings</h1>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            {group.title && (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <NavLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">Back to application</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
