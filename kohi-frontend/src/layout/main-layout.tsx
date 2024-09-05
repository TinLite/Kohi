import SideNav from "@/components/side-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Outlet } from "react-router-dom";
import LoginSheet from "../components/login";

export default function MainLayout() {
  return (
    <div className="bg-muted dark:bg-muted/10">
      <div className="flex items-start min-h-screen mx-auto">
        <SideNav />

        <div className="flex-grow relative">
          <ScrollArea className="h-screen">
            <Outlet />
          </ScrollArea>
          {/* <div className="absolute top-4 right-4">
            <LoginSheet />
          </div> */}
        </div>
      </div>
    </div>
  )
}