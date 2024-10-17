import { Comment } from "@/types/comment-type";
import { Post } from "../types/post-type";
import { User } from "../types/user-type";
export async function createComment(postId: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/create/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
      body: JSON.stringify({
        content: content,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create comment");
  }
}
export async function listCommentsByPostId(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/list/${postId}`,
    {
      // headers: {
      //   Authorization: `Bearer ${localStorage.backend_access_token}`,
      // },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  const data = await response.json();
  return data as {
    data: Comment[];
    pagination: {
      currentPage: number;
      totalPage: number;
      totalElement: number;
      limit: number;
    };
  };
}
export async function likeComment(commentId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/like/${commentId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to like comment");
  }
}
export async function unLikeComment(commentId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/unlike/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to unlike comment");
  }
}
