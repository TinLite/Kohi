import { getAllPostsAdmin } from "@/repository/PostsRepository";
import { Post, PostFlags } from "@/types/post-type";
import { EllipsisVertical, Eye, Filter } from "lucide-react";
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
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function AdminPosts() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "hidden" | "active">(
    "all"
  );
  useEffect(() => {
    navigate(`?page=${currentPage}`, { replace: true });
  }, [currentPage, navigate]);

  // Debounce phần search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(encodeURIComponent(searchQuery));
      if (searchQuery) {
        setCurrentPage(1); // Chỉ quay về trang 1 khi từ khóa tìm kiếm thay đổi
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch dữ liệu khi currentPage hoặc debouncedQuery thay đổi
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await getAllPostsAdmin(currentPage, 10, debouncedQuery);
        setPosts(res.data || []);
        setTotalPages(res.pagination.totalPage || 1);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    }
    fetchPosts();
  }, [currentPage, debouncedQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const filteredPosts = posts.filter((post) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "hidden")
      return post.flags?.includes(PostFlags.HIDDEN);
    if (filterStatus === "active")
      return !post.flags?.includes(PostFlags.HIDDEN);
    return true;
  });

  return (
    <div className="w-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-6">Post Administration</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <Input
          type="text"
          placeholder="Search posts..."
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
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Create At</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={post.author.avatar || ""} />
                        <AvatarFallback>
                          {post.author.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {post.author.displayName || post.author.username}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{post.content}</TableCell>
                  <TableCell className="text-right">
                    {new Date(post.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    {post.flags?.includes(PostFlags.HIDDEN) ? (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        navigate(`/admin/posts/detail/${post._id}`);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Không tìm thấy bài viết.
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

