import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { likeComment, unLikeComment } from "@/repository/comment-repository";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { useContext, useState } from "react";
import { Comment } from "../types/comment-type";
import { Button } from "./ui/button";

export default function CommentItem({ comment }: { comment: Comment }) {
  const {user} = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.includes(user ? user._id : "") ?? 0
  );
  const handleLikeComment = async () => {
    try {
      await likeComment(comment._id);
      setIsLiked(true);
    } catch (err) {
      console.error(err);
    }
  };
  const handleUnLikeComment = async () => {
    try {
      await unLikeComment(comment._id);
      setIsLiked(false);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-grow">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center justify-center gap-2"
        onClick={isLiked ? handleUnLikeComment : handleLikeComment}
      >
        <ThumbsUp className={cn("w-4 h-4", isLiked ? "fill-primary" : "")} />
      </Button>
      <Button variant="ghost" size="sm" className="ml-2">
        <MessageCircle className="w-4 h-4" /> Reply
      </Button>
    </div>
  );
}
