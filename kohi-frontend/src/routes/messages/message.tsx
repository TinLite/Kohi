import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function MessageSelectionItem({ selected = false }: { selected?: boolean }) {
    return (
        <button className={[
            "w-full flex gap-4 px-4 py-2 mb-2 rounded-md border",
            "hover:bg-accent",
            selected ? "bg-muted" : ""
        ].join(' ')}>
            <Avatar>
                <AvatarImage src="https://i.pravatar.cc/300" className="rounded-full" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-left text-sm">
                <div className="flex justify-between">
                    <span className="font-bold">User</span>
                    <span className="pl-2 text-muted-foreground text-sm">3 giờ trước</span>
                </div>
                <div className="text-muted-foreground">Last message</div>
            </div>
        </button>
    )
}

export default function MessagePage() {
    return (
        <div className="flex flex-grow h-screen">
            <div className="bg-background flex flex-col h-screen w-96 max-w-[100vw]">
                <div className="w-full px-4 py-2">
                    <h1 className="text-xl font-bold">Tin nhắn</h1>
                </div>
                <Separator />
                <ScrollArea className="flex-grow flex flex-col items-stretch p-4">
                    <MessageSelectionItem />
                    <MessageSelectionItem />
                    <MessageSelectionItem />
                    <MessageSelectionItem />
                </ScrollArea>
            </div>
            <Separator orientation="vertical" />
            <div className="flex-grow flex h-screen flex-col">
                <div className="px-4 py-2 bg-background">
                    <h1 className="text-xl font-bold">Tin nhắn</h1>
                </div>
                <Separator />
                <ScrollArea className="flex-grow pb-4">

                </ScrollArea>
                <Separator />
                <div className="bg-background flex gap-2 px-4 py-2">
                    <Input placeholder="Nhập tin nhắn..." className="flex-grow" />
                    <Button>Gửi</Button>
                </div>
            </div>
        </div>
    );
}