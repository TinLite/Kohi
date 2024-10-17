import { useEffect, useState } from "react";
import DetailPost from "./detail-post-comment";
import { listCommentsByPostId } from "@/repository/comment-repository";
import { useParams } from "react-router-dom";
import { Post } from "@/types/post-type";
import { Comment } from "@/types/comment-type";
import { getPostsById } from "@/repository/PostsRepository";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await getPostsById(id);
          console.log(response);
          setPost(response);
        } catch (err) {
          console.error("Error fetching post:", err);
        }
      };
      fetchPost();
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      const fetchComments = async () => {
        try {
          const response = await listCommentsByPostId(id);
          setComments(response.data);
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      };
      fetchComments();
    }
  }, [id]);

  if (!post) {
    return <div>Loading post...</div>;
  }
  return <DetailPost post={post} comment={comments} />;
};

export default PostPage;
