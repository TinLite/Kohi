import { User } from "@/types/user-type";

export async function getProfile(userId: string = "me") {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/users/profile/${userId}/detail`, {
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (!data.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return await data.json() as User
}
export async function searchUsers(query: string) {
    const respone = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/users/search?query=${query}`, {
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (!respone.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return await respone.json() as User[]
}