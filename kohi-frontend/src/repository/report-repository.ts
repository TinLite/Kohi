import { Report } from "@/types/report-types";

export default async function getAllReportsAdmin(
  page = 1,
  limit = 5,
  query = "",
  handled?: string
) {
  let url = `${import.meta.env.VITE_BACKEND_BASE_URL}/${
    import.meta.env.VITE_API_PREFIX
  }/reports/list?page=${page}&limit=${limit}&query=${query}`;
  if (handled !== undefined) url += `&handled=${handled}`;
  const response = await fetch(url, {
    credentials: "include",
  });
  const data = await response.json();
  return data as {
    data: Report[];
    pagination: {
      currentPage: number;
      totalPage: number;
      totalElement: number;
      limit: number;
    };
  };
}
export async function reportTarget(
  type: "post" | "comment",
  targetId: string,
  reason: string
) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/create/${type}/${targetId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }), // Đúng key cho CreateReportDto
    }
  );
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw errorData;
  }
  return response.json();
}
export async function rejectReport(reportId: string, handleReason: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/reject/${reportId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ handleReason }), // Đúng key
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to reject report: ${response.statusText}`);
  }

  return response.json();
}
export async function approveReport(reportId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/approve/${reportId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to approve report: ${response.statusText}`);
  }

  return response.json();
}
