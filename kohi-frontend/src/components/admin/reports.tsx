import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Report } from "@/types/report-types";

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchReports() {
      try {
        // const response = await getAllReportsAdmin(activeTab, searchQuery, currentPage);
        // setReports(response.data || []);
        // setTotalPages(response.pagination?.totalPage || 1);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    }
    fetchReports();
  }, [activeTab, searchQuery, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewReport = (reportId: string) => {
    console.log("View report", reportId);
    // Add logic to view the report details
  };

  const handleHideReport = (reportId: string) => {
    console.log("Hide report", reportId);
    // Add logic to hide the report
  };

  const handleRejectReport = (reportId: string) => {
    console.log("Reject report", reportId);
    // Add logic to reject the report
  };

  return (
    <div className="w-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-6">Report Administration</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-1/3"
        />
      </div>
      <Tabs defaultValue="posts" onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex gap-4">
          <TabsTrigger value="posts">Post Reports</TabsTrigger>
          <TabsTrigger value="comments">Comment Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <Table className="w-full text-base">
            <TableHeader>
              <TableRow>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.userId}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{new Date(report.timeStamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                            <EllipsisVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewReport(report._id)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleHideReport(report._id)}>
                            Hide
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectReport(report._id)}>
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="comments">
          <Table className="w-full text-base">
            <TableHeader>
              <TableRow>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.userId}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{new Date(report.timeStamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                            <EllipsisVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewReport(report._id)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleHideReport(report._id)}>
                            Hide
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectReport(report._id)}>
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
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
