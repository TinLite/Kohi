import { Bookmark, MessageCircle, Repeat, Repeat2, Send, Share2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function UserPost() {
  return (
    <Card>
      <div className="flex px-6 py-4 flex-row gap-4 items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/tinlite.png" className="rounded-full" alt="@shadcn" />
          <AvatarFallback>V</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold">Vinh</div>
          <div className="text-muted-foreground text-sm">@TinLite - October 1, 2023</div>
        </div>
      </div>
      <div className="px-6 mb-4">
        <p>
          Checkout this cute cat! #CatIsLife
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