import { Bell, Bookmark, House, MessageSquareMore, Search, Settings } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function SideNav() {
  return (
    <aside className="fixed md:sticky flex min-h-screen flex-col justify-between gap-4 px-2 py-4 bg-background border-r shadow">
      <a href="#" className="flex items-center md:justify-start px-4 justify-center rounded-lg">
        コー<br/>ヒー
      </a>
      <nav className="grid gap-4">
        <a href="#" className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground text-accent-foreground">
          <House />
          Home
        </a>
        <a href="#" className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
          <Search />
          Search
        </a>
        <a href="#" className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
          <MessageSquareMore />
          Message
        </a>
        <a href="#" className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
          <Bell />
          Notification
        </a>
        <a href="#" className="flex h-9 items-center gap-2 pl-4 pr-12 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
          <Bookmark />
          Bookmark
        </a>
        <a href="#" className="flex h-9 px-4 items-center gap-2 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
          <Avatar className="w-6 h-6">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-full" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          Profile
        </a>
      </nav>
      <div className="flex justify-around gap-2">
        <ModeToggle />
        <a href="#" className="flex h-9 w-9 justify-center items-center gap-2 rounded-lg font-bold transition-colors hover:text-foreground hover:bg-accent text-muted-foreground">
          <Settings />
        </a>
      </div>
    </aside>
  )
}