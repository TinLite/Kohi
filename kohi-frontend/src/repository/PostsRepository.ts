import { Post } from "@/types/PostType";

export async function getGlobalLatestPosts() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/posts/list`, {
        cache: 'no-cache',
    });
    return await response.json() as Post[];
}