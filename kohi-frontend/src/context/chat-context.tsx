import { getChannel, getChannelList } from "@/repository/chat-repository";
import socket from "@/services/socket";
import { ChatChannel, ChatMessage } from "@/types/chat-types";
import { SocketEvent } from "@/types/socket-types";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "./user-context";

export const ChatContext = createContext<{
    chatChannelList: ChatChannel[],
    setChatChannelList: Dispatch<SetStateAction<ChatChannel[]>>,
    chatChannel: ChatChannel | null,
    setChatChannel: Dispatch<SetStateAction<ChatChannel | null>>,
    refreshChannel: () => void
}>({
    chatChannelList: [],
    setChatChannelList: () => { },
    chatChannel: null,
    setChatChannel: () => { },
    refreshChannel: () => { }
});

export function ChatProvider({ children, channelData, channelId }: { children: ReactNode, channelData?: ChatChannel, channelId?: string }) {
    const { user } = useContext(UserContext);
    const { channelID } = useParams();
    const navigate = useNavigate();
    const [chatChannel, setChatChannel] = useState<ChatChannel | null>(channelData ?? null);
    const [chatChannelList, setChatChannelList] = useState<ChatChannel[]>([]);
    
    function refreshChannel() {
        console.debug("refreshChannel", channelID);
        if (!channelID) return;
        getChannel(channelID).then(setChatChannel)
    }
    
    useEffect(() => {
        refreshChannel()
    }, [channelID]);
    
    useEffect(() => {
        if (!user?._id)
            return navigate(`/login?redirect=${location.pathname}`);
        getChannelList().then(setChatChannelList);
    }, [user?._id]);

    // socket
    useEffect(() => {
        if (!user?._id) return;

        function handleNewMessage(newMessage: ChatMessage) {
            const channel = chatChannelList.find((c) => c._id === newMessage.channelID)
            if (channel) {
                const newChannel = {
                    ...channel,
                    latestMessage: newMessage,
                }
                setChatChannelList([
                    newChannel,
                    ...chatChannelList.filter((c) => c._id !== newChannel._id),
                ])
            }
        }

        function handleUpdateMessage(updatedMessage: ChatMessage) {
            const channel = chatChannelList.find((c) => c._id === updatedMessage.channelID)
            if (channel && channel.latestMessage?._id === updatedMessage._id) {
                const newChannel = {
                    latestMessage: updatedMessage,
                    ...channel,
                }
                setChatChannelList([
                    ...chatChannelList.filter((c) => c._id !== newChannel._id),
                    newChannel
                ])
                
            }
        }

        socket.on(SocketEvent.CHAT_MESSAGE_NEW, handleNewMessage);
        socket.on(SocketEvent.CHAT_MESSAGE_UPDATE, handleUpdateMessage)
        return () => {
            socket.off(SocketEvent.CHAT_MESSAGE_NEW, handleNewMessage);
            socket.off(SocketEvent.CHAT_MESSAGE_UPDATE, handleUpdateMessage);
        }
    }, [user?._id, chatChannelList])
    
    return (
        <ChatContext.Provider value={{ chatChannelList, setChatChannelList, chatChannel, setChatChannel, refreshChannel }}>
            {children}
        </ChatContext.Provider>
    )
}