import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getFollowerList } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";

function AddedRecipent({ name, avatarImage, onRemove }: { name: string, avatarImage?: string, onRemove?: () => void }) {
    return (
        <div className="flex gap-2 items-center bg-accent rounded-xl border border-transparent hover:border-muted-foreground/25 p-2">
            <Avatar>
                <AvatarImage src={avatarImage} />
                <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex">
                <p className="font-bold">{name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onRemove}>
                <Minus />
            </Button>
        </div>
    )
}

export default function MessageViewNewChat() {

    const [followerList, setFollowerList] = useState<User[]>([]);
    const [recipents, setRecipents] = useState<User[]>([]);
    const [newChannelName, setNewChannelName] = useState<string>("");

    useEffect(() => {
        getFollowerList().then(setFollowerList)
    }, [])

    function onSendMessage() {

    }

    let timer: NodeJS.Timeout;

    function onAddRecipentTypeIn(event: React.FormEvent<HTMLInputElement>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            const currentQuery = (event.target as HTMLInputElement).value.toLowerCase();
            if (currentQuery.trim() == "") return;
            const foundUser = followerList.find((user) => user.username.toLowerCase().includes(currentQuery));
            console.log(currentQuery, foundUser)
            if (foundUser) {
                setRecipents([...recipents, foundUser]);
                (event.target as HTMLInputElement).value = "";
            }
        }, 500);
    }

    return (
        <div className="h-screen bg-background flex-grow flex flex-col">
            <h1 className="font-semibold text-xl py-2 px-4">Tạo cuộc trò chuyện mới</h1>
            <Separator />
            <ScrollArea className="flex-grow">
                <div className="px-4 py-8">
                    <div className="grid grid-cols-4 align-middle gap-4">
                        <div className="text-right my-1">New channel name:</div>
                        <Input placeholder="Type in new chat channel's name..." className="w-full col-span-3" />
                        <div className="text-right my-1">Recipents:</div>
                        <div className="col-span-3">
                            <div className="grid w-fit gap-2">
                                {recipents.map((recipent) => (
                                    <AddedRecipent name={recipent.username} avatarImage={recipent.avatar} key={recipent._id} onRemove={() => {
                                        setRecipents(recipents.filter((r) => r._id != recipent._id))
                                    }} />
                                ))}
                                {recipents.length == 0 &&
                                    <p className="text-sm mt-2">No recipent yet~</p>
                                }
                            </div>
                        </div>
                        <div className="col-start-2 col-span-full flex flex-col">
                            <Input placeholder="Add recipent" onInput={onAddRecipentTypeIn} />
                            <p className="text-sm text-muted-foreground">You can only add accounts which currently following you</p>

                        </div>
                    </div>
                </div>
            </ScrollArea>
            <Separator />
            <div className="bg-background flex gap-2 px-4 py-2">
                <form onSubmit={onSendMessage} className="flex-grow flex gap-2">
                    <Input placeholder="Nhập tin nhắn..." className="flex-grow" name="content" />
                    <Button>Gửi</Button>
                </form>
            </div>
        </div>
    )
}