import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Bell,
  Bookmark,
  House,
  LogIn,
  MessageSquareMore,
  Search,
  Settings
} from "lucide-react";
import LoginSheet from "./login";
import { ModeToggle } from "./mode-toggle";

export default function SideNav() {
  return (
    <aside className="fixed z-10 md:sticky max-md:w-full bg-background border-r shadow overflow-y-scroll bottom-0 max-md:py-4">
      <div className="md:min-h-screen flex flex-col md:justify-between gap-4 px-2 md:py-4">
        <a
          href="#"
          className="hidden md:flex items-end px-4 gap-2 font-bold"
        >
          <div>
            コー
            <br />
            ヒー
          </div>
        </a>
        <nav className="grid gap-4 max-md:grid-cols-6">
          <a
            href="#"
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground text-accent-foreground"
          >
            <House />
            <span className="hidden md:block">
              Home
            </span>
          </a>
          <a
            href="#"
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Search />
            <span className="hidden md:block">
              Search
            </span>
          </a>
          <a
            href="#"
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <MessageSquareMore />

            <span className="hidden md:block">
              Message
            </span>
          </a>
          <a
            href="#"
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Bell />

            <span className="hidden md:block">
              Notification
            </span>
          </a>
          <a
            href="#"
            className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
          >
            <Bookmark />
            <span className="hidden md:block">
              Bookmark
            </span>
          </a>
          {false ? (
            <a
              href="#"
              className="flex h-9 px-4 items-center max-md:mx-auto gap-2 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  className="rounded-full"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="hidden md:block">
                Profile
              </span>
            </a>
          ) : (
            <LoginSheet>
              <button className="flex h-9 items-center max-md:mx-auto gap-2 px-4 md:pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
                <LogIn />
                <span className="hidden md:block">
                  Login
                </span>
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
