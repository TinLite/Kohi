import { Post } from "@/types/post-type";

export async function getGlobalLatestPosts() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/posts/list`, {
        headers: {
            'Authorization': `Bearer ${localStorage.backend_access_token}`,
        },
        
    });
    return await response.json() as Post[];
}