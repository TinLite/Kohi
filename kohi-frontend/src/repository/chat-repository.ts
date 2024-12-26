import { ChatChannel, ChatMessage } from "@/types/chat-types";

export async function getChannelList(participants: string[] = []) {
    let url = `${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels`;
    if (participants.length > 0) {
        const data = new URLSearchParams({
            participants: participants.join(','),
        }).toString();
        url += `?participants=${participants.join(',')}`;
    }
    const data = await fetch(url, {
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

export async function getChannel(channelId: string) {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
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
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Failed to update chat channel");
    }
    return await response.json() as ChatChannel;
}

export async function getChannelMessages(channelId: string) {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/chat/channels/${channelId}/messages`, {
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
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
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
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
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to recall message");
    }
}