import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ArrowLeft,
  BookText,
  MessageCircle,
  MonitorSmartphone,
  Moon,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const { setTheme } = useTheme();
  return (
    <Sidebar>
      <SidebarHeader>
        <Button variant="ghost" className="w-full">
          <NavLink to="/admin" className="flex items-center font-bold text-sm">
            コー
            <br />
            ヒー
            <span className="ml-2 font-bold text-sm">Admin</span>
          </NavLink>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/users">
                <Users className="w-5 h-5" />
                <span className="font-semibold text-sm">Users</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/posts">
                <BookText className="w-5 h-5" />
                <span className="font-semibold text-sm">Posts</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/admin/comments">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold text-sm">Comments</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-start">
              <Settings className="w-5 h-5" />
              <span className="ml-2">Theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <MonitorSmartphone className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" className="flex items-center justify-start">
          <NavLink to="/" className="flex items-center">
            <ArrowLeft className="w-5 h-5" />
            <span className="ml-2">Back to application</span>
          </NavLink>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
