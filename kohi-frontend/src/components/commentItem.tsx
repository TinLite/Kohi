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
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import CommentUI from "./comment";
import { Post } from "@/types/post-type";

export default function CommentItem({ comment }: { comment: Comment }) {
  const { user } = useContext(UserContext);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.includes(user ? user._id : "") ?? 0
  );
  const [total, setTotal] = useState(comment.likes?.length ?? 0);

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

  return (
    <div className="flex flex-col space-y-2 p-4 rounded-lg shadow-sm max-h-60 overflow-y-auto">
      <div className="flex items-center space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage
            src="https://github.com/QuangTeoo.png"
            className="rounded-full"
            // alt='https://github.com/QuangTeoo.png'
          />
          {/* <AvatarFallback>{comment.author.displayName.charAt(0) || 'U'}</AvatarFallback> */}
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{comment.author.displayName}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.timeStamp || "").toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
      <div className="text-gray-700">{comment.content}</div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={toggleLikeComment} className="flex items-center justify-center gap-2">
          <ThumbsUp className={cn("w-4 h-4", isLiked ? "fill-primary" : "")} />
          {total}
        </Button>
        <Button variant="ghost" size="sm">
          Reply
        </Button>
      </div>
    </div>
  );
}
