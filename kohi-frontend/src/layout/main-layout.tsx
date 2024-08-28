import SideNav from "@/components/side-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="bg-muted dark:bg-muted/10">
      <div className="flex items-start min-h-screen mx-auto">
        <SideNav />
        <div className="flex-grow">
          <ScrollArea className="h-screen">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}