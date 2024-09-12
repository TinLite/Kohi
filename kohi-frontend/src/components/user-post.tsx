import { Bookmark, MessageCircle, MessagesSquare, Repeat, Send, ThumbsUp, UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Post } from "@/types/post-type";
import { User } from "@/types/user-type";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

function UserHoverCard({ children, user }: { children?: React.ReactNode, user: User }) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 max-w-full">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} className="rounded-full" alt={user.username} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div>
                <span className="font-bold">{user.displayName ?? user.username}</span>
                <span className="pl-2 text-muted-foreground text-sm">@{user.username}</span>
              </div>
              <div className="text-sm">{user.bio ?? "Một người dùng Ko-Hi"}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button>
              <UserRoundPlus className="w-4 h-4 mr-2" />
              Add friend
            </Button>
            <Button variant="secondary">
              <MessagesSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default function UserPost({ post }: { post: Post }) {
  return (
    <Card>
      <div className="flex px-6 py-4 flex-row gap-4 items-center">
        <UserHoverCard user={post.author}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author.avatar} className="rounded-full" alt="@shadcn" />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
        </UserHoverCard>
        <div>
          <UserHoverCard user={post.author}>
            <div className="font-bold">{post.author.displayName ?? post.author.username}</div>
          </UserHoverCard>
          <div className="text-muted-foreground text-sm">
            <UserHoverCard user={post.author}>
              @{post.author.username}
            </UserHoverCard> - {post.createdAt.toLocaleString()}</div>
        </div>
      </div>
      <div className="px-6 mb-4">
        <p>
          {post.content}
        </p>
      </div>
      {/* <img src="https://cataas.com/cat" alt="cat" className="mt-4 mx-auto max-w-xl max-h-[36rem] object-contain"/> */}
      <Separator />
      <div className="flex justify-between gap-2 px-4 py-2">
        <div className="flex gap-2">
          <Button variant='ghost' size='sm' className="flex items-center justify-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            2
          </Button>
          <Button variant='ghost' size='sm' className="flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className="flex items-center justify-center gap-2">
                <Repeat className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Repost</DropdownMenuItem>
              <DropdownMenuItem>Quote...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className="flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Send via message to...</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Share to...</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Facebook</DropdownMenuItem>
                    <DropdownMenuItem>Twitter</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Copy link</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button variant='ghost' size='sm' className="flex items-center justify-center gap-2">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}