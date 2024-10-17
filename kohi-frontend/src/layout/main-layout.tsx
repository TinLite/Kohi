import SideNav from "@/components/side-nav";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="bg-muted dark:bg-muted/10">
      <div className="flex items-start min-h-screen mx-auto">
        <SideNav />
        <div className="flex-grow relative h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
