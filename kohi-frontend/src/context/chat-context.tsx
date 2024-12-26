import { getChannel } from "@/repository/chat-repository";
import { ChatChannel } from "@/types/chat-types";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

export const ChatContext = createContext<{
    chatChannel: ChatChannel | null,
    setChatChannel: Dispatch<SetStateAction<ChatChannel | null>>,
    refreshChannel: () => void
}>({
    chatChannel: null,
    setChatChannel: () => { },
    refreshChannel: () => { }
});

export function ChatProvider({ children, channelData, channelId }: { children: ReactNode, channelData?: ChatChannel, channelId?: string }) {
    const [chatChannel, setChatChannel] = useState<ChatChannel | null>(channelData ?? null);
    function refreshChannel() {
        if (!channelId) return;
            getChannel(channelId).then(setChatChannel)
    }
    useEffect(() => {
        refreshChannel()
    }, [channelId]);
    console.log("ChatContext", chatChannel)
    return (
        <ChatContext.Provider value={{ chatChannel, setChatChannel, refreshChannel }}>
            {children}
        </ChatContext.Provider>
    )
}