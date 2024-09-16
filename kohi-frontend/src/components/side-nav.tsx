import { User } from "@/types/user-type";
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
import { useEffect, useState } from "react";
import LoginSheet from "./login";
import { ModeToggle } from "./mode-toggle";
import { getProfile } from "@/repository/user-repository";
import { NavLink } from "react-router-dom";

export default function SideNav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getProfile()
      .then((u) => {
        console.log(u);
        setUser(u);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="fixed z-10 md:sticky max-md:w-full bg-background border-r shadow overflow-y-scroll bottom-0 max-md:py-4">
      <div className="md:min-h-screen flex flex-col md:justify-between gap-4 px-2 md:py-4">
        <a href="#" className="hidden md:flex items-end px-4 gap-2 font-bold">
          <div>
            コー
            <br />
            ヒー
          </div>
        </a>
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
          <a
            href="#"
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Bell />

            <span className="hidden md:block">Notification</span>
          </a>
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
                  className="rounded-full"
                  alt={`@${user.username}`}
                />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block">Profile</span>
            </NavLink>
          ) : (
            <LoginSheet>
              <button className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
                <LogIn />
                <span className="hidden md:block">Login</span>
              </button>
            </LoginSheet>
          )}
        </nav>
        <div className="hidden md:flex justify-around gap-2">
          <ModeToggle />
          <a
            href="#"
            className="flex h-9 w-9 justify-center items-center gap-2 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Settings />
          </a>
        </div>
      </div>
    </aside>
  );
}
