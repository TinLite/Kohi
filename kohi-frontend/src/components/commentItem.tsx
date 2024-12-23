import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import {
  likeComment,
  listCommentsByPostId,
  unLikeComment,
} from "@/repository/comment-repository";
import { MessageCircle, Repeat, ThumbsUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Comment } from "../types/comment-type";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import CommentUI from "./comment";
import { Post } from "@/types/post-type";
import ReplyComment from "./replycomment";

const CommentItem = ({
  comment,
  allComments,
}: {
  comment: Comment;
  allComments: Comment[];
}) => {
  const { user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.includes(user ? user._id : "") ?? 0
  );
  const [total, setTotal] = useState(comment.likes?.length ?? 0);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const toggleLikeComment = async () => {
    if (isLiked) {
      await unLikeComment(comment._id);
      setTotal(total - 1);
    } else {
      await likeComment(comment._id);
      setTotal(total + 1);
    }
    setIsLiked(!isLiked);
  };
  useEffect(() => {
    const commentReplies = allComments.filter((c) => c.replyTo === comment._id);
    setReplies(commentReplies);
  }, [allComments, comment._id]);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  return (
    <div className="space-y-4">
    <div className="flex items-start gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={comment.author.avatar}
          className="rounded-full"
          alt={comment.author.displayName}
        />
        <AvatarFallback>{comment.author.displayName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p className="text-gray-700 font-bold">{comment.author.displayName}</p>
        <p className="text-gray-700">{comment.content}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLikeComment}
            className="flex items-center justify-center gap-2"
          >
            <ThumbsUp className={cn("w-4 h-4", isLiked ? "fill-primary" : "")} />
            {total}
          </Button>
          <ReplyComment comment={comment}/>
          {replies.length > 0 && (
            <Button variant="ghost" size="sm" onClick={toggleReplies}>
              {showReplies ? "Hide Replies" : `View Replies (${replies.length})`}
            </Button>
          )}
        </div>
      </div>
    </div>
    {showReplies && replies.length > 0 && (
      <div className="ml-4 mt-4 space-y-4">
        {replies.map((reply) => (
          <CommentItem key={reply._id} comment={reply} allComments={allComments} />
        ))}
      </div>
    )}
  </div>
  );
};
export default CommentItem;
