import {
  Bell,
  Bookmark,
  House,
  LogIn,
  MessageSquareMore,
  Search,
  Settings,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import LoginSheet from "./login";
import { useState } from "react";

export default function SideNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <aside className="fixed md:sticky flex min-h-screen flex-col justify-between gap-4 px-2 py-4 bg-background border-r shadow">
      <a
        href="#"
        className="flex items-center md:justify-start px-4 justify-center rounded-lg"
      >
        コー
        <br />
        ヒー
      </a>
      <nav className="grid gap-4">
        <a
          href="#"
          className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground text-accent-foreground"
        >
          <House />
          Home
        </a>
        <a
          href="#"
          className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
        >
          <Search />
          Search
        </a>
        <a
          href="#"
          className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
        >
          <MessageSquareMore />
          Message
        </a>
        <a
          href="#"
          className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
        >
          <Bell />
          Notification
        </a>
        <a
          href="#"
          className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
        >
          <Bookmark />
          Bookmark
        </a>
        {isLoggedIn ? (
          <a
            href="#"
            className="flex h-9 px-4 items-center gap-2 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-full"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            Profile
          </a>
        ) : (
          <LoginSheet>
            <button className="flex h-9 items-center gap-2 pl-3 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
              <LogIn />
              Login
            </button>
          </LoginSheet>
        )}
      </nav>
      <div className="flex justify-around gap-2">
        <ModeToggle />
        <a
          href="#"
          className="flex h-9 w-9 justify-center items-center gap-2 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
        >
          <Settings />
        </a>
      </div>
    </aside>
  );
}
