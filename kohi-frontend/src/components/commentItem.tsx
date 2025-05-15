import { UserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import {
  deleteComment,
  likeComment,
  reportComment,
  unLikeComment,
  updateComment,
} from "@/repository/comment-repository";
import {
  Edit,
  EllipsisVertical,
  ShieldAlert,
  ThumbsUp,
  Trash,
} from "lucide-react";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Comment } from "../types/comment-type";
import ReplyComment from "./replycomment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
const CommentItem = ({
  comment,
  allComments,
  onReply,
  onDeleteComment,
  onUpdateComment,
  showReplies, // Nhận trạng thái mở rộng từ cha
  onToggleReplies, // Nhận callback để thay đổi trạng thái
  focusedCommentId,
}: {
  comment: Comment;
  allComments: Comment[];
  onReply?: () => void;
  onDeleteComment?: () => void;
  onUpdateComment?: () => void;
  showReplies: boolean;
  onToggleReplies: () => void;
  focusedCommentId: string | null;
}) => {
  const { user, setLoginFormOpen } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.includes(user ? user._id : "") ?? 0
  );
  const [total, setTotal] = useState(comment.likes?.length ?? 0);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [content, setContent] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [reason, setReason] = useState("");
  const handleCloseReport = () => {
    setIsOpenReport(false);
    setReason("");
  };
  useEffect(() => {
    const commentReplies = allComments.filter((c) => c.replyTo === comment._id);
    setReplies(commentReplies);
  }, [allComments, comment._id]);

  const handleSubmitReport = () => {
    if (!reason.trim()) return;
    reportComment(comment._id, reason)
      .then(() => {
        toast.success("Report submitted successfully");
        setReason("");
        setIsOpenReport(false);
      })
      .catch((err) => {
        if (
          err?.statusCode === 409 ||
          err?.message?.includes("already reported")
        ) {
          toast.info("You have already reported this post");
          setReason("");
          setIsOpenReport(false);
        } else {
          toast.error("Failed to submit report");
          console.error(err);
        }
      });
  };
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
  const isFocused = comment._id === focusedCommentId; // Kiểm tra nếu comment được focus
  return (
    <div
      className={cn(
        "space-y-4 border bg-card rounded-lg p-4",
        isFocused ? "bg-primary/10 border-primary" : "" // Thêm class nếu được focus
      )}
    >
      <div className="flex items-start gap-4 px-6 pt-4">
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
              <p className="font-bold">
                {comment.author.displayName}
                <span className="text-sm text-muted-foreground font-normal">
                  {" "}
                  @{comment.author.username}
                  {` - ${DateTime.fromISO(
                    comment.timeStamp!.toString()
                  ).toRelative()}`}
                </span>
              </p>
              <p className="">{comment.content}</p>
              <p className="text-sm text-muted-foreground"></p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical />
                </Button>
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
                {user?._id !== comment.author._id && (
                  <DropdownMenuItem onClick={() => setIsOpenReport(true)}>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Báo cáo
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <AlertDialog open={isOpenReport} onOpenChange={handleCloseReport}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Report</AlertDialogTitle>
                <AlertDialogDescription>
                  <Textarea
                    placeholder="Enter the reason for your report..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-2"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitReport}
                  disabled={!reason.trim()}
                >
                  Submit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              {total || ""}
            </Button>
            <ReplyComment comment={comment} onReply={onReply} />
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
              focusedCommentId={focusedCommentId} // Truyền ID của comment đang được focus
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
