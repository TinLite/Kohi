import { Comment } from "@/types/comment-type";
export async function createComment(postId: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/create/${postId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        content: content,
      }),
    }
  );
  if (!response.ok) {
    return response.json();
  }
  return response.json();
}
export async function updateComment(commentId: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/update/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        content: content,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update comment");
  }
}

export async function replyToComment(replyTo: string, content: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/reply/${replyTo}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        content: content,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to reply comment");
  }
}

export async function listCommentsByPostId(postId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/list/${postId}`, {
      credentials: 'include',
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
      credentials: 'include',
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
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error("Failed to unlike comment");
  }
}
export async function listCommentByReplyTo(replyTo: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/list/reply/${replyTo}`, {}
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
export async function deleteComment(commentId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/delete/${commentId}`,
    {
      method: "DELETE",
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
}
export async function reportComment(commentId: string, reason: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/comment/${commentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        reason: reason,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to report comment");
  }
}
export async function getCommentByAuthor(authorId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/comments/list/author/${authorId}`, {
      credentials: 'include',
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
