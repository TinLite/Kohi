import { UserContext } from "@/context/user-context";
import {
  createComment
} from "@/repository/comment-repository";
import { Post } from "@/types/post-type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MessageCircle } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

const CommentUI = ({
  postId,
  post,
  onCreatedComment,
}: {
  postId: string;
  post: Post;
  onCreatedComment?: () => void;
}) => {
  const [newComment, setNewComment] = useState("");
  const { user, setLoginFormOpen } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleCreateComment = () => {
    if (!newComment.trim()) return;
    createComment(postId, newComment)
      .then(() => {
        if (!user) {
          toast.error("Please login to post");
          setLoginFormOpen(true);
          return;
        }
        setNewComment("");
        onCreatedComment?.();
        setIsOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <div className="flex px-6 py-4 flex-row gap-4 items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={post.author.avatar}
                className="rounded-full"
                alt="@shadcn"
              />
              <AvatarFallback>{post.author.username[0]}</AvatarFallback>
            </Avatar>

            <div>
              <div className="font-bold">
                {post.author.displayName ?? post.author.username}
              </div>

              <div className="text-muted-foreground text-sm">
                @{post.author.username}-{" "}
                {new Date(post.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
          <div className="px-6 mb-4">
            <p className="hyphens-auto" style={{
              "lineClamp": 3,
              "display": "-webkit-box",
              "overflow": "hidden",
              "WebkitLineClamp": 3,
              "WebkitBoxOrient": "vertical",
              "overflowWrap": "anywhere"
            }}>
              {post.content
                ?.split("\n")
                .filter((v) => v)
                .map((v, i) => {
                  return (
                    <span key={i}>
                      {v}
                      <br />
                    </span>
                  );
                })}
            </p>
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
                <AvatarFallback>
                  {user?.displayName?.charAt(0) || "CN"}
                </AvatarFallback>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentUI;
