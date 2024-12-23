import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Comment } from "@/types/comment-type";
import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { Separator } from "./ui/separator";
import { replyToComment } from "@/repository/comment-repository";
import { useNavigate } from "react-router-dom";
export default function ReplyComment({ comment }: { comment: Comment }) {
  const { user } = useContext(UserContext);
  const [replyComment, setReplyComment] = useState("");
  const navigate = useNavigate();
  const handleReplyComment = async () => {
    if (!replyComment.trim()) return;
    try {
      await replyToComment(comment._id, replyComment);
      setReplyComment("");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Dialog>
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
            <p className="text-gray-700 font-bold">
              {comment.author.displayName}
            </p>
            <p className="text-gray-700">{comment.content}</p>
            <span className="text-sm text-gray-500">
              {new Date(comment.timeStamp || "").toLocaleString("vi-VN")}
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
