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
import { reportTarget } from "@/repository/report-repository";
import { toast } from "sonner";

export function ReportDialog({
  targetId,
  type,
}: {
  targetId: string;
  type: "post" | "comment";
}) {
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsDropdownOpen(false); // Đóng Dropdown
  };

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    reportTarget(type, targetId, reason) // Gọi API với type và targetId
      .then(() => {
        toast.success("Report submitted successfully");
        setReason("");
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to submit report");
      });
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsDropdownOpen(false);
              handleOpen();
            }}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setIsDropdownOpen(false); // Đóng Dropdown khi Dialog đóng
          }
        }}
      >
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