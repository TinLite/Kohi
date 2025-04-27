import LoginSheet from "@/components/login";
import SideNav from "@/components/side-nav";
import { UserContext } from "@/context/user-context";
import socket from "@/services/socket";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout({disableNavOnPhone = false}: {disableNavOnPhone?: boolean}) {
  const { user, loginFormOpen, setLoginFormOpen } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      socket.connect();
    } else if (socket.active) {
      socket.disconnect();
    }
    return () => {
      if (socket.active) {
        socket.disconnect();
      }
    }
  }, [user?._id]);

  return (
    <div className="bg-muted dark:bg-muted/10">
      <div className="flex items-start min-h-dvh mx-auto">
        <SideNav disableNavOnPhone={disableNavOnPhone} />
        <div className="flex-grow relative min-h-dvh">
          <LoginSheet open={loginFormOpen} onOpenChange={() => setLoginFormOpen(false)} />

          <Outlet />
        </div>
      </div>
    </div>
  );
}
