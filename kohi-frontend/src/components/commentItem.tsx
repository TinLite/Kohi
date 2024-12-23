import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import {
  deleteComment,
  likeComment,
  listCommentsByPostId,
  unLikeComment,
} from "@/repository/comment-repository";
import {
  MessageCircle,
  MoreHorizontal,
  Repeat,
  ThumbsUp,
  EllipsisVertical,
  Trash,
  Edit,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Comment } from "../types/comment-type";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CommentUI from "./comment";
import { Post } from "@/types/post-type";
import ReplyComment from "./replycomment";

const CommentItem = ({
  comment,
  allComments,
  onReply,
  onDeleteComment,
}: {
  comment: Comment;
  allComments: Comment[];
  onReply?: () => void;
  onDeleteComment?: () => void;
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
  const removeComment = async () => {
    await deleteComment(comment._id)
      .then(() => {
        onDeleteComment?.();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={comment.author.avatar ?? ""}
            className="rounded-full"
            alt={comment.author.displayName}
          />
          <AvatarFallback>
            {comment.author.displayName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-bold">
                {comment.author.displayName}
              </p>
              <p className="text-gray-700">{comment.content}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={removeComment}>
                  <Trash className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLikeComment}
              className="flex items-center justify-center gap-2"
            >
              <ThumbsUp
                className={cn("w-4 h-4", isLiked ? "fill-primary" : "")}
              />
              {total}
            </Button>
            <ReplyComment comment={comment} onReply={onReply} />
            {replies.length > 0 && (
              <Button variant="ghost" size="sm" onClick={toggleReplies}>
                {showReplies
                  ? "Hide Replies"
                  : `View Replies (${replies.length})`}
              </Button>
            )}
          </div>
        </div>
      </div>
      {showReplies && (
        <div className="pl-10">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              allComments={allComments}
              onReply={onReply}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CommentItem;
