import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import {
  deleteComment,
  likeComment,
  listCommentsByPostId,
  unLikeComment,
  updateComment,
} from "@/repository/comment-repository";
import {
  MessageCircle,
  MoreHorizontal,
  Repeat,
  ThumbsUp,
  EllipsisVertical,
  Trash,
  Edit,
  ShieldAlert,
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { DateTime } from "luxon";
const CommentItem = ({
  comment,
  allComments,
  onReply,
  onDeleteComment,
  onUpdateComment,
  showReplies, // Nhận trạng thái mở rộng từ cha
  onToggleReplies, // Nhận callback để thay đổi trạng thái
}: {
  comment: Comment;
  allComments: Comment[];
  onReply?: () => void;
  onDeleteComment?: () => void;
  onUpdateComment?: () => void;
  showReplies: boolean;
  onToggleReplies: () => void;
}) => {
  const { user, setLoginFormOpen } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.includes(user ? user._id : "") ?? 0
  );
  const [total, setTotal] = useState(comment.likes?.length ?? 0);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [content, setContent] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const commentReplies = allComments.filter((c) => c.replyTo === comment._id);
    setReplies(commentReplies);
  }, [allComments, comment._id]);

  const toggleLikeComment = async () => {
    if (isLiked) {
      if (!user) {
        toast.error("Please login to post");
        setLoginFormOpen(true);
        return;
      }
      await unLikeComment(comment._id);
      setTotal(total - 1);
    } else {
      if (!user) {
        toast.error("Please login to post");
        setLoginFormOpen(true);
        return;
      }
      await likeComment(comment._id);
      setTotal(total + 1);
    }
    setIsLiked(!isLiked);
  };
  const removeComment = async () => {
    await deleteComment(comment._id)
      .then(() => {
        if (!user) {
          toast.error("Please login to post");
          setLoginFormOpen(true);
          return;
        }
        onDeleteComment?.();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleEdit = () => {
    setIsEditing(true);
    setContent(comment.content);
  };
  const handleupdateComment = async () => {
    await updateComment(comment._id, content)
      .then(() => {
        if (!user) {
          toast.error("Please login to post");
          setLoginFormOpen(true);
          return;
        }
        onUpdateComment?.();
        setIsEditing(false);
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
              <p className="text-sm text-muted-foreground">
                {comment.timeStamp
                  ? DateTime.fromISO(comment.timeStamp.toString()).toRelative()
                  : ""}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {(user?._id === comment.author._id ||
                  user?._id === comment.postId.author._id) && (
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user?._id === comment.author._id && (
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Sửa
                  </DropdownMenuItem>
                )}
                {(user?._id === comment.author._id ||
                  user?._id === comment.postId.author._id) && (
                  <DropdownMenuItem onClick={removeComment}>
                    <Trash className="mr-2 h-4 w-4" />
                    Xóa
                  </DropdownMenuItem>
                )}
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
            {replies.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onToggleReplies}>
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
              onUpdateComment={onUpdateComment}
              showReplies={showReplies} // Truyền trạng thái xuống
              onToggleReplies={onToggleReplies} // Truyền callback xuống
            />
          ))}
        </div>
      )}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogTitle className="text-lg font-bold mb-4">
            Edit Comment
          </DialogTitle>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none focus-visible:ring-0 min-h-0"
          />
          <Button onClick={handleupdateComment}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentItem;
