import { useEffect, useState } from "react";
import DetailPost from "./detail-post-comment";
import { useParams } from "react-router-dom";
import { Post } from "@/types/post-type";
import { getPostsById } from "@/repository/PostsRepository";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await getPostsById(id);
          // console.log(response);
          setPost(response);
        } catch (err) {
          console.error("Error fetching post:", err);
        }
      };
      fetchPost();
    }
  }, []);

  if (!post) {
    return <div className="text-center py-4">Loading post...</div>;
  }
  return (
    <div>
      <DetailPost post={post} />
    </div>
  );
};

export default PostPage;
