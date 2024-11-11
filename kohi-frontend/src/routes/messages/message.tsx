import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context/user-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { getChannelList, getChannelMessages, sendMessage } from "@/repository/chat-repository";
import socket from "@/services/socket";
import { ChatChannel, ChatChannelType, ChatMessage } from "@/types/chat-types";
import { SocketEvent } from "@/types/socket-types";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function UserMessage({className, isMe, name, avatar, image, noPaddingTop, message }: { className?: string, isMe?: boolean, name?: string, avatar?: string, image?: string, noPaddingTop?: boolean, message?: string }) {
    return (
        <div
            className={cn([
                "flex gap-2 px-4",
                (isMe ? "flex-row-reverse" : ""),
                (noPaddingTop ? "mt-1" : "mt-4"),
                className
            ])}>
            {!isMe &&
                <div className="w-10 flex items-end">
                    {avatar &&
                        <Avatar className="w-10 h-10 shadow">
                            <AvatarImage src={avatar} className="rounded-full" alt="User" />
                            <AvatarFallback>{name?.charAt(0) ?? '@'}</AvatarFallback>
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
                    )}>{name}</div>
                }
                <div className={cn(
                    "rounded-md shadow",
                    (isMe ? "bg-primary/10 border border-primary/20" : "bg-background")
                )}>
                    <div className="px-4 py-2">
                        {
                            message?.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))
                        }
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

function MessageChannelView({ channel, className }: { channel: ChatChannel, className?: string }) {

    const navigate = useNavigate();

    const [reducedMessage, setReducedMessage] = useReducer((state: ChatMessage[], action: {
        type: 'append' | 'prepend' | 'replace',
        payload: ChatMessage[]
    }) => {
        switch (action.type) {
            case 'append':
                return [...state, ...action.payload];
            case 'prepend':
                return [...action.payload, ...state];
            case 'replace':
                return action.payload;
        }
    }, []);
    const [channelName, setChannelName] = useState<string | undefined>(channel.name);
    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const { user } = useContext(UserContext);
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);

    const [isScrolling, setIsScrolling] = useState(false);
    
    function scrollToBottom() {
        const target = scrollAreaRef.current?.querySelector('.h-full.w-full.rounded-\\[inherit\\]')
        target?.scrollTo({ top: target?.scrollHeight, behavior: 'smooth' });
    }

    useEffect(() => {
        getChannelMessages(channel._id).then((messages) => {setReducedMessage({type: 'replace', payload: messages.reverse()})});
    }, [channel])

    useEffect(() => {
        if (!user) {
            return;
        }
        if (channel.type === ChatChannelType.PRIVATE) {
            const targetUser = channel.participants.find(p => p.user._id !== user?._id)?.user;
            if (targetUser) {
                setChannelName(targetUser.displayName ?? `@${targetUser.username}`);
                setAvatar(targetUser.avatar);
            }
        } else {
            setChannelName(channel.participants.map(p => p.user.displayName ?? `@${p.user.username}`).join(', '));
        }
        socket.on(SocketEvent.CHAT_MESSAGE_NEW, (newMessage: ChatMessage) => {
            if (newMessage.channelID === channel._id) {
                setReducedMessage({type: 'append', payload: [newMessage]});
            }
        });
        return () => {
            socket.off(SocketEvent.CHAT_MESSAGE_NEW);
        }
    }, [channel, user])

    useEffect(() => {
        if (isScrolling) {
            return;
        }
        scrollToBottom();
    }, [reducedMessage])

    const onSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.querySelector('input') as HTMLInputElement;
        const message = input.value;
        input.value = '';
        sendMessage(channel._id, message).then((newMessage) => {
            setReducedMessage({type: 'append', payload: [newMessage]});
        });
    }

    const onMessageScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const newScrollState = (target.scrollTop + target.clientHeight < target.scrollHeight - 10);
        if (newScrollState !== isScrolling) {
            setIsScrolling(newScrollState);
        }
    }

    return (
        <div className={cn(className, "flex-grow flex h-screen flex-col")}>
            <div className="md:px-4 py-0.5 bg-background flex items-center">
                <Button variant="ghost" onClick={() => navigate('/message')} size="icon">
                    <ChevronLeft />
                </Button>
                <Avatar className="w-8 h-8 shadow mr-4">
                    <AvatarImage src={avatar} className="rounded-full" alt="User" />
                    <AvatarFallback>{channelName?.charAt(0) ?? '-'}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-bold">Display Name <span className="font-normal text-muted-foreground">@username</span></h1>
                    <h4 className="text-xs">Online</h4>
                </div>
            </div>
            <Separator />
            <ScrollArea ref={scrollAreaRef} onScroll={onMessageScroll} className="flex-grow flex flex-col-reverse">
                {
                    reducedMessage.map((message) => {
                        const isMe = message.senderID._id === user?._id;
                        return (
                            <UserMessage
                                className="last:pb-4"
                                key={message._id}
                                isMe={isMe}
                                name={isMe ? undefined : message.senderID.displayName ?? message.senderID.username}
                                avatar={isMe ? undefined : message.senderID.avatar}
                                message={message.content}
                            />
                        )
                    })
                }
            </ScrollArea>
            <Separator />
            <form onSubmit={onSendMessage} className="bg-background flex gap-2 px-4 py-2">
                <Input placeholder="Nhập tin nhắn..." className="flex-grow" />
                <Button>Gửi</Button>
            </form>
        </div>
    )
}

export default function MessagePage() {

    const isOnPhone = useMediaQuery('(max-width: 768px)');
    const {channelID} = useParams();

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
    console.log(isOnPhone, channelID);
    return (
        <div className="flex flex-grow h-screen">
            <div className={cn(
                "bg-background flex flex-col h-screen w-96 max-w-[100vw]",
                isOnPhone ? "flex-grow" : "",
                isOnPhone && channelID ? "hidden" : ""
            )}>
                <div className="w-full px-4 py-2">
                    <h1 className="text-xl font-bold">Tin nhắn</h1>
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
            <Separator orientation="vertical" className={isOnPhone ? "hidden" : ""} />
            {
                selectedChannel ?
                    <MessageChannelView channel={selectedChannel} /> :
                    <div className={cn(isOnPhone && !channelID ? "hidden" : "flex-grow flex items-center justify-center")}>
                        <h1 className="text-2xl text-muted-foreground">Chọn một cuộc trò chuyện</h1>
                    </div>
            }
        </div>
    );
}