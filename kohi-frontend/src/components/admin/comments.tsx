import { getAllCommentsAdmin } from "@/repository/comment-repository";
import { Comment } from "@/types/comment-type";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function AdminComments() {
  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(encodeURIComponent(searchQuery));
      if (searchQuery) {
        setCurrentPage(1); // Chỉ quay về trang 1 khi từ khóa tìm kiếm thay đổi
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await getAllCommentsAdmin(currentPage, 10, debouncedQuery);
        setComments(res.data || []);
        setTotalPages(res.pagination.totalPage || 1);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    }
    fetchComments();
  }, [currentPage, debouncedQuery]);

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
      </div>
      <div className="overflow-x-auto min-h-[300px]">
        <Table className="w-full text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-left">Author</TableHead>
              <TableHead className="text-right">Content</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length > 0 ? (
              comments.map((comment) => (
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
                  <TableCell className="text-right">
                    {comment.content}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(comment.timeStamp || "").toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownComment comment={comment} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No comments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
export function DropdownComment({ comment }: { comment: Comment }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="w-8 h-8 p-0">
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              // navigate(`/admin/users/detail/${user?._id}`);
              setOpenDropdown(false);
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenConfirm(true);
              setOpenDropdown(false);
            }}
          >
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will hide the post. You can undo this later in
              settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenConfirm(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive">Confirm</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
