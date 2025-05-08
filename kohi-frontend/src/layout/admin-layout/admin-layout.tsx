import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider className="flex h-screen w-full">
      <AdminSidebar />
      <SidebarTrigger />
      <div className="flex-grow relative flex  p-6 w-full">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
