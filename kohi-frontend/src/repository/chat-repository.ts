import { ChatChannel } from "@/types/chat-types";

export async function getChannelList() {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/`, {
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (!data.ok) {
        throw new Error("Failed to fetch chat channels");
    }
    return await data.json() as ChatChannel[];
}

export async function createChannel(members: string[], message: string[], name?: string) {
    const respone = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/create`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
        body: JSON.stringify({
            name,
            participants: members,
            firstMessage: message
        }),
    });
    if (!respone.ok) {
        throw new Error(`Failed to create chat channel: ${await respone.text()}`);
    }
    return await respone.json() as ChatChannel
}