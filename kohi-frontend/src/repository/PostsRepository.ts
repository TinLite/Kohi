import { Post } from "@/types/post-type";
import { get } from "node:http";

export async function getGlobalLatestPosts() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/list`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
      body: formData,
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return await response.json();
}

export async function searchPosts(query: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/search?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  if (!response.ok) {
    return response.json();
  }
}
export async function unLikePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/unlike`,
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
export async function countLikePost(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/${postId}/likes`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      // headers: {
      //   Authorization: `Bearer ${localStorage.backend_access_token}`,
      // },
      method: "GET",
    }
  );
  return (await response.json()) as Post;
}
export async function getPostsByUserId() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/profile/list`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  return (await response.json()) as Post[];
}

export async function getMediaByUserId() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/profile/media`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  return response.json();
}