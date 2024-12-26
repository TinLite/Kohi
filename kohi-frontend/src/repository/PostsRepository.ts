import { Post } from "@/types/post-type";

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
export async function updatePostsShare(postId: string, content: string) {
  console.log("Hi", postId, content);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/updateshare`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
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
export async function updatePost(postId: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/detail/${postId}/update`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
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
  return response.json();
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
  return response.json();
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
export async function getPostsByUserId(id = "") {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/posts/profile/list/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  return response.json();
}
