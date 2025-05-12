import { Report } from "@/types/report-types";

export default async function getAllReportsAdmin() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/reports/admin`,
    {
      credentials: "include",
    }
  );
  return (await response.json()) as Report[];
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
