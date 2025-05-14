import {
  getAllCommentsAdmin,
  hideComment,
  unHideComment,
} from "@/repository/comment-repository";
import { Comment, CommentFlags } from "@/types/comment-type";
import { EllipsisVertical, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function AdminComments() {
  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [commentTarget, setCommentTarget] = useState<Comment | null>(null);
  const [actionType, setActionType] = useState<"hide" | "unhide">("hide");
  const [filterStatus, setFilterStatus] = useState<"all" | "hidden" | "active">(
    "all"
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(encodeURIComponent(searchQuery));
      if (searchQuery) {
        setCurrentPage(1);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchComments = async () => {
    getAllCommentsAdmin(currentPage, 10, debouncedQuery)
      .then((res) => {
        setComments(res.data || []);
        setTotalPages(res.pagination.totalPage || 1);
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
      });
  };
  useEffect(() => {
    fetchComments();
  }, [currentPage, debouncedQuery]);

  const handleHideComment = async (commentId: string) => {
    if (!commentId) return;
    hideComment(commentId)
      .then(() => {
        fetchComments();
      })
      .catch((err) => {
        console.error("Failed to hide comment:", err);
      });
  };
  const handleUnhideComment = async (commentId: string) => {
    if (!commentId) return;
    unHideComment(commentId)
      .then(() => {
        fetchComments();
      })
      .catch((err) => {
        console.error("Failed to unhide comment:", err);
      });
  };
  const filteredComments = comments.filter((comment) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "hidden")
      return comment.flags?.includes(CommentFlags.HIDDEN);
    if (filterStatus === "active")
      return !comment.flags?.includes(CommentFlags.HIDDEN);
    return true;
  });
  useEffect(() => {
    navigate(`?page=${currentPage}`, { replace: true });
  }, [currentPage, navigate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-6">Comment Administration</h2>
      <div className="flex flex-col sm:flex-row gap-6 mb-2">
        <Input
          type="text"
          placeholder="Search comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="w-4 h-4" />
            Filter:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                {filterStatus === "all"
                  ? "All"
                  : filterStatus === "hidden"
                  ? "Hidden"
                  : "Active"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("hidden")}>
                Hidden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto min-h-[300px]">
        <Table className="w-full text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-left">Author</TableHead>
              <TableHead className="">Content</TableHead>
              <TableHead className="text-right">Create At</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={
                            comment.author.avatar ||
                            "https://github.com/QuangTeoo.png"
                          }
                        />
                        <AvatarFallback>
                          {comment.author.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {comment.author.displayName || comment.author.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="">{comment.content}</TableCell>
                  <TableCell className="text-right">
                    {new Date(comment.timeStamp || "").toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    {comment.flags?.includes(CommentFlags.HIDDEN) ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-red-500">Hidden</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-green-500">Active</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {comment.flags?.includes(CommentFlags.HIDDEN) ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setCommentTarget(comment);
                          setActionType("unhide");
                          setOpenConfirm(true);
                        }}
                      >
                        Unhide
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCommentTarget(comment);
                          setOpenConfirm(true);
                        }}
                      >
                        Hide
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No comments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {actionType === "hide"
                    ? "Are you sure you want to hide this comment?"
                    : "Are you sure you want to unhide this comment?"}
                </AlertDialogTitle>
                <div className="flex items-center gap-4 mt-2 mb-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={
                        commentTarget?.author.avatar ||
                        "https://github.com/QuangTeoo.png"
                      }
                      alt={
                        commentTarget?.author.displayName ||
                        commentTarget?.author.username
                      }
                    />
                    <AvatarFallback>
                      {commentTarget?.author.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-base">
                      {commentTarget?.author.displayName}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      @{commentTarget?.author.username}
                    </div>
                  </div>
                </div>
                <AlertDialogDescription>
                  <span className="font-semibold">Comment content:</span>
                  <div className="border rounded p-2 mt-1 bg-muted text-base">
                    {commentTarget?.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    You can undo this action later in the admin panel.
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenConfirm(false);
                    setCommentTarget(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!commentTarget) return;
                    if (actionType === "hide") {
                      handleHideComment(commentTarget._id);
                    } else {
                      handleUnhideComment(commentTarget._id);
                    }
                    setOpenConfirm(false);
                    setCommentTarget(null);
                  }}
                >
                  {actionType === "hide" ? "Confirm hide" : "Confirm unhide"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(i + 1)}
              className="w-10 h-10 p-0 mb-2"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
