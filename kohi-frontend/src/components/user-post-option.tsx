import { Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Post } from "@/types/post-type";
import {
  deletePost,
  updatePost,
  updatePostsShare,
} from "@/repository/PostsRepository";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import UserPost from "./user-post";
import { Textarea } from "./ui/textarea";
export function UserPostOption({
  post,
  onDelete,
  onUpdateShare,
  onEditPost,
}: {
  post: Post;
  onDelete?: () => void;
  onUpdateShare?: () => void;
  onEditPost?: () => void;
}) {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [content, setContent] = useState(post.content);
  const handleDelete = async () => {
    deletePost(post._id)
      .then(() => {
        onDelete?.();
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };
  const handleUpdatePost = async () => {
    if (post.postShare?._id) {
      await updatePostsShare(post._id, content)
        .then((updatedPost) => {
          onUpdateShare?.();
          setIsEditOpen(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      await updatePost(post._id, content)
        .then((updatedPost) => {
          onEditPost?.();
          setIsEditOpen(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleOpenEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isEditOpen} onOpenChange={handleCloseEdit}>
        <DialogContent>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Edit your post content..."
              className="resize-none w-full p-2"
            ></Textarea>
          </DialogDescription>
          <UserPost post={post} hideComment />
          <div className="flex justify-end">
            <Button variant="default" onClick={handleUpdatePost}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
