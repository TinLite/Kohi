import { Report } from "@/types/report-types";

export default async function getAllReportsAdmin(page = 1, limit = 5, query = "") {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/list?page=${page}&limit=${limit}&query=${query}`,
    {
      credentials: "include",
    }
  );
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
    }/reports/${type}/${targetId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to report ${type}: ${response.statusText}`);
  }

  return response.json();
}
