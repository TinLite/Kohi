import { SettingSidebar } from "@/components/settings/SettingSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserContext } from "@/context/user-context";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function LayoutSetting() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?._id) navigate("/login");
  }, []);
  return (
    <SidebarProvider>
      <SettingSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
