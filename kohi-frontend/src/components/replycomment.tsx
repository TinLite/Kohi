import { UserContext } from "@/context/user-context";
import { replyToComment } from "@/repository/comment-repository";
import { Comment } from "@/types/comment-type";
import { DateTime } from "luxon";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
export default function ReplyComment({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply?: () => void;
}) {
  const { user, setLoginFormOpen } = useContext(UserContext);
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [replyComment, setReplyComment] = useState("");
  const handleReplyComment = async () => {
    if (!replyComment.trim()) return;
    try {
      if (!user) {
        toast.error("Please login to post");
        setLoginFormOpen(true);
        return;
      }
      await replyToComment(comment._id, replyComment);
      setReplyComment("");
      setIsOpenReply(false);
      onReply?.();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog open={isOpenReply} onOpenChange={setIsOpenReply}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Reply
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-start gap-2 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={comment.author.avatar}
              className="rounded-full"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-bold">
              {comment.author.displayName}
            </p>
            <p>{comment.content}</p>
            <span className="text-sm text-muted-foreground">
              {comment.timeStamp
                ? DateTime.fromISO(comment.timeStamp.toString()).toRelative()
                : ""}
            </span>
          </div>
        </div>
        <Separator />
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={user?.avatar}
                className="rounded-full"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Textarea
              className="resize-none p-0 border-0 focus-visible:ring-0 min-h-0"
              placeholder="Add a reply..."
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
            />
            <Button variant="default" onClick={handleReplyComment}>
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
