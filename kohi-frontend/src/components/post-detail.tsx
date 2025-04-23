import { getPostsById } from "@/repository/PostsRepository";
import { Post } from "@/types/post-type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailPost from "./detail-post-comment";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  const fetchPost = async () => {
    if (id) {
      try {
        const response = await getPostsById(id);
        // console.log(response);
        setPost(response);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  if (!post) {
    return <div className="text-center py-4">Loading post...</div>;
  }

  function handleDeletePost() {
    navigate("/");
  }

  return (
    <div>
      <DetailPost post={post} onEditPost={fetchPost} onDeletePost={handleDeletePost} />
    </div>
  );
};

export default PostPage;
