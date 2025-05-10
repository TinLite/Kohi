import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useSearchParams
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AdminGetAllUsers } from "@/repository/user-repository";
import { User } from "@/types/user-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";

export default function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams(); // Hook để quản lý query params
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1 // Lấy giá trị từ query params
  );
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, pagination } = await AdminGetAllUsers(
          currentPage,
          itemsPerPage,
          debouncedQuery
        );
        setUsers(data || []);
        setTotalPages(pagination?.totalPage || 1);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, debouncedQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
      // setSearchParams({ page: "1" }); // Cập nhật query params về trang 1
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // useEffect(() => {
  //   const pageFromParams = Number(searchParams.get("page"));
  //   if (pageFromParams && pageFromParams !== currentPage) {
  //     setCurrentPage(pageFromParams);
  //   }
  // }, [searchParams]);

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };
  return (
    <div className="w-full px-6 py-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Users</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/3"
          />
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          <Table className="w-full text-base">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] text-left">Avatar</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.avatar || ""} />
                        <AvatarFallback>
                          {user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.displayName || user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <DropdownUser user={user} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No results found.
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
    </div>
  );
}
export function DropdownUser({ user }: { user?: User }) {
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
            navigate(`/admin/users/detail/${user?._id}`);
            setOpenDropdown(false);
          }}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
