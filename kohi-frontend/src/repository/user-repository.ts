import { User } from "@/types/user-type";
import { Post } from "../types/post-type";

export async function getProfile(userId: string = "me") {
  const data = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/${userId}/detail`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.backend_access_token}`,
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  return  response.json();
}
export async function getBookMarks() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/profile/bookmark`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search bookmarks");
  }
  return (await response.json()) as Post[];
}
export async function getFollowing() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/follows/list/following`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get following");
  }
  const data = await response.json();
  return data as {
    data: User[];
    pagination: {
      currentPage: number;
      totalPage: number;
      totalElement: number;
      limit: number;
    };
  };
}
export async function updateAvatar(userId: string, formData: FormData) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/avatar/${userId}/update`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get profile user");
  }
  return (await response.json()) as User;
}
