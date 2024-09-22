import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

function UserMessage({ isMe, name, avatar, image, noPaddingBottom }: { isMe?: boolean, name?: string, avatar?: string, image?: string, noPaddingBottom?: boolean }) {
    return (
        <div
            className={[
                "flex gap-2 px-4",
                (isMe ? "flex-row-reverse" : ""),
                (noPaddingBottom ? "mb-1" : "mb-4")
            ].join(' ')}>
            {!isMe &&
                <div className="w-10 flex items-end">
                    {avatar &&
                        <Avatar className="w-10 h-10 shadow">
                            <AvatarImage src={avatar} className="rounded-full" alt="User" />
                            <AvatarFallback>K</AvatarFallback>
                        </Avatar>
                    }
                </div>
            }
            <div className="max-w-[50%]">
                {
                    name &&
                    <div className={cn(
                        "text-muted-foreground text-sm px-4",
                        (isMe ? "text-right" : "text-left")
                    )}>Username</div>
                }
                <div className={cn(
                    "rounded-md shadow",
                    (isMe ? "bg-primary/10 border border-primary/20" : "bg-background")
                )}>
                    <div className="px-4 py-2">
                        Hi chat<br />
                        Tưởng tượng là đây là một tin nhắn dài
                    </div>
                    {
                        image &&
                        <div className="flex justify-center max-h-96 rounded-b-md bg-black">
                            <img src={image} alt="Shared" className="object-contain rounded-b-md" />
                        </div>
                    }
                </div>
            </div>
        </div>
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
                <div className="px-4 py-0.5 bg-background flex items-center gap-4">
                    <Avatar className="w-8 h-8 shadow">
                        <AvatarImage src="https://i.pravatar.cc/300" className="rounded-full" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-bold">Display Name <span className="font-normal text-muted-foreground">@username</span></h1>
                        <h4 className="text-xs">Online 1h trước</h4>
                    </div>
                </div>
                <Separator />
                <ScrollArea className="flex-grow py-4">
                    <UserMessage isMe />
                    <UserMessage name="Username" avatar="https://i.pravatar.cc/300" />
                    <UserMessage isMe />
                    <UserMessage name="Username" avatar="https://i.pravatar.cc/300" image="https://cataas.com/cat" />
                    <UserMessage isMe noPaddingBottom />
                    <UserMessage isMe />
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