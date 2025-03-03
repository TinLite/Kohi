import { ChatChannel, ChatMessage } from "@/types/chat-types";

export async function getChannelList(participants: string[] = []) {
    let url = `${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels`;
    if (participants.length > 0) {
        url += `?participants=${participants.join(',')}`;
    }
    const data = await fetch(url, {
        credentials: 'include',
    });
    if (!data.ok) {
        throw new Error("Failed to fetch chat channels");
    }
    return await data.json() as ChatChannel[];
}

export async function createChannel(members: string[], message: string, name?: string) {
    const respone = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
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
    return await respone.json() as {
        channel: ChatChannel,
        latestMessage: ChatMessage,
    }
}

export async function getChannel(channelId: string) {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}`, {
        credentials: 'include',
    });
    if (!data.ok) {
        throw new Error("Failed to fetch chat channel");
    }
    return await data.json() as ChatChannel;
}

export async function updateChannel(channelId: string, data: {
    name?: string;
    avatar?: File;
}) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (value !== undefined) {
            formData.append(key, value);
        }
    });
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to update chat channel");
    }
    return await response.json() as ChatChannel;
}

export async function getChannelMessages(channelId: string) {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}/messages`, {
        credentials: 'include',
    });
    if (!data.ok) {
        throw new Error("Failed to fetch chat messages");
    }
    return await data.json() as ChatMessage[];
}

export async function sendMessage(channelId: string, data: {
    content: string;
    replyTo?: string;
}) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}/messages/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Failed to send message");
    }
    return await response.json() as ChatMessage;
}

export async function recallMesssage(channelId: string, messageId: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error("Failed to recall message");
    }
}