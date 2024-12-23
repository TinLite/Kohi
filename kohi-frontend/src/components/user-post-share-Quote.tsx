import { useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Post } from "@/types/post-type";
import UserPost from "./user-post";
import { Textarea } from "./ui/textarea";
import { createSharePostQuote } from "@/repository/PostsRepository";

const UserPostShareQuote = ({
  isOpen,
  onClose,
  onShareQuote,
  post,
}: {
  isOpen: boolean;
  onClose: () => void;
  onShareQuote?: () => void;
  post: Post;
}) => {
  const [content, setContent] = useState("");
  const handleCreateShareQuote = async () => {
    await createSharePostQuote(post._id, content)
      .then(() => {
        onShareQuote?.();
        onClose();
      })
      .catch((error) => {
        console.error("Failed to share quote", error);
      });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Quote Post</DialogTitle>
        <DialogDescription>
          <Textarea
            value={content}
            placeholder="Write your quote here..."
            className="resize-none w-full p-2 border rounded"
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </DialogDescription>
        <UserPost post={post} hideComment />
        <div className="flex justify-end">
          <Button variant="default" onClick={handleCreateShareQuote}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPostShareQuote;
