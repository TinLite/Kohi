import { useEffect, useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical, Filter } from "lucide-react";
import { Report } from "@/types/report-types";
import getAllReportsAdmin from "@/repository/report-repository";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "handled" | "unhandled"
  >("all");
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery) setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    getAllReportsAdmin(currentPage, 5, debouncedQuery)
      .then((response) => {
        setReports(response.data || []);
        setTotalPages(response.pagination?.totalPage || 1);
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
      });
  }, [currentPage, debouncedQuery]);
  const filteredReports = reports.filter((report) => {
    if (statusFilter === "handled" && !report.handled) return false;
    if (statusFilter === "unhandled" && report.handled) return false;
    return true;
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewReport = (reportId: string) => {
    console.log("View report", reportId);
  };

  const handleHideReport = (reportId: string) => {
    console.log("Hide report", reportId);
  };

  const handleRejectReport = (reportId: string) => {
    console.log("Reject report", reportId);
  };

  useEffect(() => {
    navigate(`?page=${currentPage}`, { replace: true });
  }, [currentPage, navigate]);

  return (
    <div className="w-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-6">Report Administration</h2>
      <div className="flex flex-col sm:flex-row gap-6 mb-2">
        <Input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={handleSearchChange}
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
                {statusFilter === "all"
                  ? "All"
                  : statusFilter === "handled"
                  ? "Handled"
                  : "Unhandled"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("handled");
                  setCurrentPage(1);
                }}
              >
                Handled
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter("unhandled");
                  // setCurrentPage(1);
                }}
              >
                Unhandled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto min-h-[300px]">
        <Table className="w-full text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Reported By</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Target ID</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={report.userId?.avatar}
                          alt={
                            report.userId?.displayName ||
                            report.userId?.username
                          }
                        />
                        <AvatarFallback>
                          {report.userId?.displayName?.[0] ||
                            report.userId?.username?.[0] ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {report.userId?.displayName ||
                            report.userId?.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{report.userId?.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.targetId}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>
                    {new Date(report.timeStamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {report.handled ? (
                      <span className="text-green-600 font-semibold">
                        Đã xử lý
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Chưa xử lý
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 p-0"
                        >
                          <EllipsisVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewReport(report._id)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleHideReport(report._id)}
                        >
                          Hide
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRejectReport(report._id)}
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No reports found.
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
