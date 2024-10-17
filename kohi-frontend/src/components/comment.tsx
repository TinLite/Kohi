import {
  createComment,
  listCommentsByPostId,
} from "@/repository/comment-repository";
import { Comment } from "@/types/comment-type";
import { Post } from "@/types/post-type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

const CommentUI = ({ postId, post }: { postId: string; post: Post }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const fetchComments = async () => {
    try {
      const response = await listCommentsByPostId(postId);
      if (response && response.data && Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        // console.log( response);
        setComments([]);
      }
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [postId]);
  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(postId, newComment);
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
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
                @{post.author.username}- {post.createdAt.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="px-6 mb-4">
            <p>
              {post.content
                .split("\n")
                .filter((v) => v)
                .map((v) => {
                  return (
                    <span>
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
                  src="https://github.com/shadcn.png"
                  className="rounded-full"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
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
