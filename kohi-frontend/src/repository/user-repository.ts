import { User } from "@/types/user-type";
import { Post } from "../types/post-type";

export async function getProfile(userId: string = "me") {
  const data = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/${userId}/detail`,
    {
      credentials: "include",
    }
  );
  if (!data.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return (await data.json()) as User;
}

export async function updateUser(userId: string, formData: any) {
  const data = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/${userId}/update`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  if (!data.ok) {
    throw new Error("Failed to update user profile");
  }
  // return (await data.json()) as User;
}

export async function searchUsers(query: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/search?query=${query}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return (await response.json()) as User[];
}

export async function followUser(userId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/add/${userId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    return response.json();
  }
}

export async function unFollowUser(userId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/unfollow/${userId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    return response.json();
  }
}

export async function addBookMark(PostId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/bookmark/add/${PostId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  return response.json();
}

export async function unBookMark(PostId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/bookmark/remove/${PostId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return response.json();
}

export async function getBookMarks() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/bookmark`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get bookmarks");
  }
  const data = await response.json();
  return data as {
    data: Post[];
    pagination: {
      currentPage: number;
      totalPage: number;
      totalElement: number;
      limit: number;
    };
  };
}

export async function searchBookMarks(query: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/bookmarks/search?query=${query}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search bookmarks");
  }
  return (await response.json()) as Post[];
}

export async function getFollowingUserList() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/list/following`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get following");
  }
  const data = await response.json();
  return data as User[];
}

export async function getFollowingCount() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/list/following/count`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get following");
  }
  const data = await response.json();
  return data as {
    followingCount: number;
  };
}

export async function getFollowerList() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/list/followers`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get following");
  }
  const data = await response.json();
  return data as User[];
}

export async function getFollowerCount() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/list/followers/count`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get following");
  }
  const data = await response.json();
  return data as User[];
}

export async function getAllFollowCountMetrics() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/list/count`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get following");
  }
  const data = await response.json();
  return data as {
    followingCount: number;
    followerCount: number;
  };
}

export async function updateAvatar(userId: string, formData: FormData) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/avatar/${userId}/update`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update avatar");
  }
  return await response.json();
}

export async function updateWall(userId: string, formData: FormData) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/wall/${userId}/update`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update wall");
  }
  return await response.json();
}

export async function getProfileUser(id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/${id}/detail`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get profile user");
  }
  return (await response.json()) as User;
}

export async function updatePassword(oldPassword: string, newPassword: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/${"me"}/password`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    }
  );
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message ?? "Failed to update password");
  }
}
export async function AdminGetAllUsers(
  page: number = 1,
  limit: number = 10,
  query?: string
) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/list?page=${page}&limit=${limit}&query=${query || ""}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get all users");
  }
  return (await response.json()) as {
    data: User[];
    pagination: {
      currentPage: number;
      totalPage: number;
      totalElement: number;
      limit: number;
    };
  };
}

export async function banUser(userId: string): Promise<void> {
  try {
    const response = await fetch(`/api/users/${userId}/ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to ban user");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function unbanUser(userId: string): Promise<void> {
  try {
    const response = await fetch(`/api/users/${userId}/unban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to unban user");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
