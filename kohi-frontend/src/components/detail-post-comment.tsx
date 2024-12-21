import { Post } from "@/types/post-type";
import UserPost from "./user-post";
import CommentItem from "./commentItem";
import { Comment } from "@/types/comment-type";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  createComment,
  listCommentsByPostId,
} from "@/repository/comment-repository";
import { ScrollArea } from "@/components/ui/scroll-area";

const DetailPost = ({ post }: { post: Post }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const response = await listCommentsByPostId(post._id);
      if (response && response.data) {
        setComments(response.data);
      } else {
        // console.log( response)
        setComments([]);
      }
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };
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
  useEffect(() => {
    fetchComments();
  }, [post._id]);

  return (
    <ScrollArea className="h-screen">
      <div className="space-y-6 py-6 max-w-2xl mx-auto">
        <UserPost post={post} />
        <div className="space-y-6">
          <div className="flex items-start gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src="https://github.com/QuangTeoo.png"
                className="rounded-full"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Textarea
              className="resize-none p-0 border-0 focus-visible:ring-0 min-h-0 flex-grow"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="default" onClick={handleCreateComment}>
              OK
            </Button>
          </div>
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
export default DetailPost;
