import { Post } from "@/types/post-type";

export async function getGlobalLatestPosts() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/list`,
    {
      credentials: "include",
    }
  );
  return (await response.json()) as Post[];
}
export async function createPosts(formData: FormData) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/create`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return await response.json();
}
export async function updatePostsShare(postId: string, content: string) {
  console.log("Hi", postId, content);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/updateshare`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update post");
  }
  return await response.json();
}
export async function updatePost(postId: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/update`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update post");
  }
  return await response.json();
}
export async function createSharePostQuote(postId: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/share`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to share post");
  }
  return await response.json();
}

export async function searchPosts(query: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/search?q=${query}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return (await response.json()) as Post[];
}
export async function likePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/like`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  return response.json();
}
export async function unLikePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/unlike`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return response.json();
}
export async function countLikePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/${postId}/likes`,
    {
      credentials: "include",
    }
  );
  return await response.json();
}
export async function getPostsById(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}`,
    {
      credentials: "include",
    }
  );
  return (await response.json()) as Post;
}
export async function getPostsByUserId(id = "") {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/profile/list/${id}`,
    {
      credentials: "include",
    }
  );
  return (await response.json()) as Post[];
}

export async function getMediaByUserId(id = "") {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/profile/media/${id}`,
    {
      credentials: "include",
    }
  );
  return response.json();
}
export async function getListPostShare(id = "") {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/profile/share/${id}`,
    {
      credentials: "include",
    }
  );
  return (await response.json()) as Post[];
}
export async function createSharePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/share`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  return response.json();
}
export async function deletePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/delete`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return response.json();
}

export async function reportPost(postId: string, reason: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/post/${postId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }
  );
  return response.json();
}
