import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Ellipsis, ShieldAlert } from "lucide-react";
import { reportPost } from "@/repository/PostsRepository";
import { toast } from "sonner";
export function ReportPostDialog({ postId }: { postId: string }) {
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSubmit = async () => {
    if (!reason.trim()) return;
    reportPost(postId, reason)
      .then(() => {
        toast.success("Report submitted successfully");
        setReason("");
        setIsOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
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
          <DropdownMenuItem onClick={handleOpen}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter the reason for your report..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2"
          />
          <DialogFooter>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ReportCommentDialog({ commentId }: { commentId: string }) {
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
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
          <DropdownMenuItem onClick={handleOpen}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter the reason for your report..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-4"
          />
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
