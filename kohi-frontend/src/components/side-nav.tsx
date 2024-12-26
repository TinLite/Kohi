import { UserContext } from "@/context/user-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Bell,
  Bookmark,
  House,
  LogIn,
  MessageSquareMore,
  Search,
  Settings,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { DropdownSetting } from "./dropdown-setting";
import UserNoti from "./noti";
import { SheetSetting } from "./sheet-settings";

export default function SideNav({
  disableNavOnPhone = false,
}: {
  disableNavOnPhone?: boolean;
}) {
  const { user, setLoginFormOpen } = useContext(UserContext);

  const isOnPhone = useMediaQuery("(max-width: 720px)");

  const [settingOpen, setSettingOpen] = useState(false);

  const [notiOpen, setNotiOpen] = useState(false);

  return (
    <aside
      className={cn(
        "fixed z-10 md:sticky max-md:w-full bg-background border-r shadow bottom-0 max-md:py-4",
        isOnPhone && disableNavOnPhone ? "hidden" : ""
      )}
    >
      <div className="md:min-h-screen flex flex-col md:justify-between gap-4 px-2 md:py-4">
        <Link to="/" className="hidden md:flex items-end px-4 gap-2 font-bold">
          <div>
            コー
            <br />
            ヒー
          </div>
        </Link>
        <nav className="grid gap-4 max-md:grid-cols-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors",
                isActive
                  ? "hover:text-foreground text-accent-foreground"
                  : "hover:bg-accent text-muted-foreground",
              ].join(" ")
            }
          >
            <House />
            <span className="hidden md:block">Home</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              [
                "flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors",
                isActive
                  ? "hover:text-foreground text-accent-foreground"
                  : "hover:bg-accent text-muted-foreground",
              ].join(" ")
            }
          >
            <Search />
            <span className="hidden md:block">Search</span>
          </NavLink>
          <NavLink
            to="/message"
            onClick={(e) => {
              if (!user) {
                setLoginFormOpen(true);
                e.preventDefault();
              }
            }}
            className={({ isActive }) =>
              [
                "flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors",
                isActive
                  ? "hover:text-foreground text-accent-foreground"
                  : "hover:bg-accent text-muted-foreground",
              ].join(" ")
            }
          >
            <MessageSquareMore />
            <span className="hidden md:block">Message</span>
          </NavLink>
          <UserNoti open={notiOpen} onOpenChange={setNotiOpen} />
          <button
            onClick={() => setNotiOpen(true)}
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Bell />
            <span className="hidden md:block">Notification</span>
          </button>
          <NavLink
            to="/bookmark"
            className={({ isActive }) =>
              [
                "flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors",
                isActive
                  ? "hover:text-foreground text-accent-foreground"
                  : "hover:bg-accent text-muted-foreground",
              ].join(" ")
            }
          >
            <Bookmark />
            <span className="hidden md:block">Bookmark</span>
          </NavLink>
          {user ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                [
                  "flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors",
                  isActive
                    ? "hover:text-foreground text-accent-foreground"
                    : "hover:bg-accent text-muted-foreground",
                ].join(" ")
              }
            >
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={user.avatar}
                  className="rounded-full "
                  alt={`@${user.username}`}
                />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block">Profile</span>
            </NavLink>
          ) : (
            <button className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground" onClick={() => setLoginFormOpen(true)}>
              <LogIn />
              <span className="hidden md:block">Login</span>
            </button>
          )}
        </nav>
        <DropdownSetting>
          <button
            className={cn(
              "hidden md:flex",
              "h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
            )}
          >
            <Settings />
            <span className="hidden md:block">Setting</span>
          </button>
        </DropdownSetting>
      </div>
      <SheetSetting
        open={settingOpen}
        onOpenChange={setSettingOpen}
        side="left"
      />
    </aside>
  );
}
