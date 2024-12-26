import { SettingSidebar } from "@/components/settings/SettingSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function LayoutSetting() {
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