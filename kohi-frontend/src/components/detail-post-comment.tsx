import { Post } from "@/types/post-type";
import UserPost from "./user-post";
import CommentItem from "./commentItem";
import { Comment } from "@/types/comment-type";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { createComment, listCommentsByPostId } from "@/repository/comment-repository";

const DetailPost = ({ post, comment }: { post: Post; comment: Comment }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
  
    const fetchComments = async () => {
      try {
        const response = await listCommentsByPostId(post._id);
        if (response && response.data && Array.isArray(response.data)) {
          setComments(response.data);
        } else {
          // console.log( response);
          setComments([]);
        }
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    };
    useEffect(() => {
      fetchComments();
    }, [post._id]);
    const handleCreateComment = async () => {
      if (!newComment.trim()) return;
      try {
        await createComment(post._id, newComment);
        setNewComment("");
        fetchComments();
      } catch (err) {
        console.error(err);
      }
    };
  return (
    <div>
      <UserPost post={post} />
      <Separator />
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="rounded-full"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Textarea
            className="resize-none p-0 border-0 focus-visible:ring-0 min-h-0"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button variant="default" onClick={handleCreateComment}>
            OK
          </Button>
        </div>
      </div>
      <div>
          <CommentItem comment={comment} />
      </div>
    </div>
  );
};
export default DetailPost;
