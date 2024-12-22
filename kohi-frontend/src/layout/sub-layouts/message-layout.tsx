import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { getChannelList } from "@/repository/chat-repository";
import { ChatChannel, ChatChannelType } from "@/types/chat-types";
import { PenLine } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

function MessageSelectionItem({ chatChannel, selected = false, onSelect }: { chatChannel: ChatChannel, selected?: boolean, onSelect?: () => void }) {
    const { user } = useContext(UserContext);
    let avatar = "https://i.pravatar.cc/300";
    let channelName = chatChannel.name ?? chatChannel._id;
    if (chatChannel.type === ChatChannelType.PRIVATE) {
        const targetUser = chatChannel.participants.find(p => p.user._id !== user?._id)?.user;
        if (targetUser) {
            avatar = targetUser.avatar ?? avatar;
            channelName = targetUser.displayName ?? `@${targetUser.username}` ?? channelName;
        }
    }
    return (
        <button
            className={cn([
                "w-full flex gap-4 px-4 py-2 mb-2 rounded-md border",
                "hover:bg-accent",
                selected ? "bg-muted" : ""
            ])}
            onClick={onSelect}
        >
            <Avatar>
                <AvatarImage src={avatar} className="rounded-full" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-grow text-left text-sm">
                <div className="flex justify-between">
                    <span className="font-bold">{channelName}</span>
                    <span className="pl-2 text-muted-foreground text-sm">3 giờ trước</span>
                </div>
                <div className="text-muted-foreground">Last message</div>
            </div>
        </button>
    )
}

export default function MessageLayout() {
    const { channelID } = useParams();

    const [channels, setChannels] = useState<ChatChannel[]>([]);
    const navigate = useNavigate();
    const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);

    const { user } = useContext(UserContext);
    useEffect(() => {
        getChannelList().then(setChannels);
    }, [user])
    useEffect(() => {
        if (channelID) {
            setSelectedChannel(channels.find(c => c._id === channelID) ?? null);
        } else {
            setSelectedChannel(null);
        }
    }, [channelID, channels])
    return (
        <div className="flex flex-grow h-screen">
            <div className={cn(
                "bg-background flex flex-col h-screen w-96 max-w-[100vw] max-md:flex-grow",
                channelID ? "max-md:hidden" : ""
            )}>
                <div className="w-full px-4 flex items-center">
                    <h1 className="text-xl font-bold py-2">Tin nhắn</h1>
                    <Link to="/message/new" className={buttonVariants({
                        size: "icon",
                        variant: "ghost",
                        className: "ml-auto"
                    })}>
                        <PenLine />
                    </Link>
                </div>
                <Separator />
                <ScrollArea className="flex-grow flex flex-col items-stretch p-4">
                    {
                        channels.map((channel) => (
                            <MessageSelectionItem
                                key={channel._id}
                                chatChannel={channel}
                                selected={selectedChannel?._id === channel._id}
                                onSelect={() => navigate(`/message/${channel._id}`)}
                            />
                        ))
                    }
                </ScrollArea>
            </div>
            <Separator orientation="vertical" className="max-md:hidden" />
            <Outlet />
        </div>
    );
}