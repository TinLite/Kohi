import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getAllPostsAdmin } from "@/repository/PostsRepository";
import { Post } from "@/types/post-type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export default function AdminPosts() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    navigate(`?page=${currentPage}`, { replace: true });
  }, [currentPage, navigate]);

  // Debounce phần search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(encodeURIComponent(searchQuery));
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

  return (
    <div className="w-full px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6">Danh sách Posts</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          type="text"
          placeholder="Tìm kiếm posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3"
        />
      </div>

      {/* Table Posts */}
      <div className="overflow-x-auto min-h-[300px]">
        <Table className="w-full text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-left">Author</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Create At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
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
                    <DropdownPost post={post} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Không tìm thấy bài viết.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => handlePageChange(i + 1)}
              className="w-10 h-10 p-0"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
export function DropdownPost({ post }: { post?: Post }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8 p-0">
          <EllipsisVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >
        <DropdownMenuItem
          onClick={() => {
            // navigate(`/admin/users/detail/${user?._id}`);
            setOpenDropdown(false);
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem>Hide</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
