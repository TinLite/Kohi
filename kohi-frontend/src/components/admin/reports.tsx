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
import getAllReportsAdmin, {
  approveReport,
  rejectReport,
} from "@/repository/report-repository";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";

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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState<Report | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      if (searchQuery) setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchReports = (
    page = currentPage,
    query = debouncedQuery,
    filter = statusFilter
  ) => {
    let handledParam;
    if (filter === "handled") handledParam = "true";
    if (filter === "unhandled") handledParam = "false";
    getAllReportsAdmin(page, 5, query, handledParam)
      .then((response) => {
        setReports(response.data || []);
        setTotalPages(response.pagination?.totalPage || 1);
      })
      .catch((err) => {
        console.error("Failed to fetch reports:", err);
      });
  };
  const handleSubmitReject = () => {
    if (!selectedReport || !rejectReason.trim()) return;
    rejectReport(selectedReport._id, rejectReason)
      .then(() => {
        setRejectDialogOpen(false);
        fetchReports();
      })
      .catch((err) => {
        console.error("Failed to reject report:", err);
      });
  };
  useEffect(() => {
    fetchReports();
  }, [currentPage, debouncedQuery, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleRejectReport = (report: Report) => {
    setSelectedReport(report);
    setRejectDialogOpen(true);
  };

  const handleApproveReport = (report: Report) => {
    setApproveTarget(report);
    setApproveDialogOpen(true);
  };
  const handleSubmitApprove = () => {
    if (!approveTarget) return;
    approveReport(approveTarget._id)
      .then(() => {
        setApproveDialogOpen(false);
        setApproveTarget(null);
        fetchReports();
      })
      .catch((err) => {
        console.error("Failed to approve report:", err);
      });
  };
  useEffect(() => {
    navigate(`?page=${currentPage}`, { replace: true });
  }, [currentPage, navigate]);

  return (
    <div className="w-full px-4 py-2">
      <AlertDialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          setRejectDialogOpen(open);
          if (!open) {
            setSelectedReport(null);
            setRejectReason("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối báo cáo</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReport && (
                <div className="mb-3">
                  <div>
                    <b>Người báo cáo:</b>{" "}
                    {selectedReport.userId?.displayName ||
                      selectedReport.userId?.username}
                  </div>
                  <div>
                    <b>Loại:</b> {selectedReport.type}
                  </div>
                  <div>
                    <b>Đối tượng:</b> {selectedReport.targetId}
                  </div>
                  <div>
                    <b>Lý do báo cáo:</b> {selectedReport.reason}
                  </div>
                </div>
              )}
              <textarea
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border rounded p-2 mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitReject}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={approveDialogOpen}
        onOpenChange={(open) => {
          setApproveDialogOpen(open);
          if (!open) setApproveTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận duyệt báo cáo</AlertDialogTitle>
            <AlertDialogDescription>
              {approveTarget && (
                <div className="mb-3 text-sm text-muted-foreground space-y-1">
                  <div>
                    <b>Người báo cáo:</b>{" "}
                    {approveTarget.userId?.displayName ||
                      approveTarget.userId?.username}
                  </div>
                  <div>
                    <b>Loại:</b> {approveTarget.type}
                  </div>
                  <div>
                    <b>Đối tượng:</b> {approveTarget.targetId}
                  </div>
                  <div>
                    <b>Lý do báo cáo:</b> {approveTarget.reason}
                  </div>
                </div>
              )}
              Bạn có chắc chắn muốn duyệt báo cáo này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitApprove}>
              Xác nhận duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <h2 className="text-2xl font-bold mb-6">Report Administration</h2>
      <div className="flex flex-col sm:flex-row gap-6 mb-2">
        {/* <Input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-1/3"
        /> */}
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
                  setCurrentPage(1);
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
            {reports.length > 0 ? (
              reports.map((report) => (
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
                    {!report.handled && (
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
                            onClick={() => handleApproveReport(report)}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRejectReport(report)}
                          >
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
