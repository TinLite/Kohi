import SideNav from "@/components/side-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";
import FriendSide from "../components/friend-side";

export default function MainLayout() {
  return (
    <div className="bg-muted dark:bg-muted/10">
      <div className="flex items-start min-h-screen mx-auto">
        <SideNav />
        <div className="flex-grow relative">
          <ScrollArea className="h-screen">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
