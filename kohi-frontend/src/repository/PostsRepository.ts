import { Post } from "@/types/post-type";

export async function getGlobalLatestPosts() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/posts/list`, {
        headers: {
            'Authorization': `Bearer ${localStorage.backend_access_token}`,
        },
        
    });
    return await response.json() as Post[];
}
export async function searchPosts(query: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/posts/search?q=${query}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return await response.json() as Post[];
}