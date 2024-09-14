import { User } from "@/types/user-type";

export async function getProfile() {
    const data = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/users/profile/${localStorage.user_id}/detail`, {
        headers: {
            Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (!data.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return await data.json() as User
}