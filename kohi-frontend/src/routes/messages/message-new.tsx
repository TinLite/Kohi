import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createChannel } from "@/repository/chat-repository";
import { getFollowerList } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AddedRecipent({ name, avatarImage, onRemove }: { name: string, avatarImage?: string, onRemove?: () => void }) {
    return (
        <div className="flex gap-2 items-center bg-accent rounded-xl border border-transparent hover:border-muted-foreground/25 p-2">
            <Avatar>
                <AvatarImage src={avatarImage} />
                <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow flex">
                <p className="font-bold">{name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onRemove}>
                <Minus />
            </Button>
        </div>
    )
}

function SearchResultEntry({ name, avatarImage, onAdd }: { name: string, avatarImage?: string, onAdd?: () => void }) {
    return (
        <div className="flex gap-2 items-center bg-accent rounded-xl border border-transparent hover:border-muted-foreground/25 p-2">
            <Avatar>
                <AvatarImage src={avatarImage} />
                <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow flex">
                <p className="font-bold">{name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onAdd}>
                <Plus />
            </Button>
        </div>
    )
}

export default function MessageViewNewChat() {

    const [followerList, setFollowerList] = useState<User[]>([]);
    const [recipents, setRecipents] = useState<User[]>([]);
    const channelNameInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const InputChannelName = forwardRef(function InputChannelName(_, ref: any) {
        const [newChannelName, setNewChannelName] = useState<string>("");
        return (
            <Input
                className="w-full col-span-3"
                placeholder="Type in new chat channel's name..."
                value={newChannelName}
                ref={ref}
                onChange={(e) => setNewChannelName(e.currentTarget.value)}
            />
        )
    })

    var addRecipentInputTimer: NodeJS.Timeout;

    function InputAddRecipent({ onAdded }: { onAdded?: (user: User) => void }) {
        const [recipentQueryResult, setRecipentQueryResult] = useState<User[]>([]);
        const [recipentQuery, setRecipentQuery] = useState<string>("");
        const location = useLocation();
        const recipentId = location.state?.recipentId;

        function handleAddRecipent(recipent: User) {
            setRecipentQueryResult([]);
            setRecipentQuery("");
            if (onAdded) onAdded(recipent);
        }

        useEffect(() => {
            if (recipentId) {
                const recipent = followerList.find((user) => user._id == recipentId);
                if (recipent) {
                    setRecipents([...recipents, recipent]);
                    setRecipentQueryResult([]);
                    setRecipentQuery("");
                }
            }
        }, [recipentId, followerList]);

        function queryUser() {
            if (addRecipentInputTimer) clearTimeout(addRecipentInputTimer);
            addRecipentInputTimer = setTimeout(() => {
                const currentQuery = recipentQuery.toLocaleLowerCase();
                if (currentQuery.trim() == "") {
                    setRecipentQueryResult([]);
                    return;
                };
                const queryResult = followerList.filter((user) => user.username.toLowerCase().includes(currentQuery));
                console.log(currentQuery, queryResult)
                if (queryResult) {
                    setRecipentQueryResult(queryResult);
                    setRecipentQuery("");
                }
            }, 500);
        }

        function onAddRecipentTypeIn(event: React.FormEvent<HTMLInputElement>) {
            setRecipentQuery(event.currentTarget.value);
            queryUser();
        }

        return (
            <>
                <Input placeholder="Add recipent" onInput={onAddRecipentTypeIn} value={recipentQuery} />
                <p className="text-sm text-muted-foreground">You can only add accounts which currently following you</p>
                <div className="flex flex-col gap-1 mt-2">
                    {
                        recipentQueryResult.map((recipent) => (
                            <SearchResultEntry name={recipent.username} avatarImage={recipent.avatar} key={recipent._id} onAdd={() => handleAddRecipent(recipent)} />
                        ))
                    }
                </div>
            </>
        )
    }

    useEffect(() => {
        getFollowerList().then(setFollowerList)
    }, [])

    console.log(followerList);
    console.log(recipents);
    console.log(channelNameInputRef.current?.value);

    function onSendMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!recipents.length) {
            toast.error("Please add at least one recipent");
            return;
        }

        var recipentIds = recipents.map((recipent) => recipent._id);

        console.log(channelNameInputRef.current!.value, recipentIds, event.currentTarget.content.value);
        createChannel(recipentIds, event.currentTarget.content.value, channelNameInputRef.current!.value).then((channel) => {
            toast.success("Channel created successfully");
            channel.channel.latestMessage = channel.latestMessage;
            navigate(`/message/${channel.channel._id}`);
        }).catch((err) => {
            toast.error(err.message);
        })
    }

    return (
        <div className="h-screen bg-background flex-grow flex flex-col">
            <div className="md:px-4 py-0.5 bg-background flex items-center">
                <Link to="/message" className={cn([buttonVariants({
                    variant: "ghost",
                    size: "icon"
                }), "md:hidden"])}>
                    <ChevronLeft />
                </Link>
                <h1 className="font-semibold py-2 md:px-4">
                    Tạo cuộc trò chuyện mới</h1>
            </div>
            <Separator />
            <ScrollArea className="flex-grow">
                <div className="px-4 py-8">
                    <div className="grid grid-cols-4 align-middle gap-4">
                        <div className="text-right my-1">New channel name:</div>
                        <InputChannelName ref={channelNameInputRef} />
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
                        <Separator />
                        <div className="col-start-2 col-span-full flex flex-col">
                            <InputAddRecipent onAdded={(user) => {
                                setRecipents([...recipents, user]);
                            }} />
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <Separator />
            <div className="bg-background flex gap-2 px-4 py-2">
                <form onSubmit={onSendMessage} className="flex-grow flex gap-2">
                    <Input placeholder="Nhập tin nhắn..." className="flex-grow" name="content" />
                    <Button disabled={
                        !recipents.length
                    }>Gửi</Button>
                </form>
            </div>
        </div>
    )
}