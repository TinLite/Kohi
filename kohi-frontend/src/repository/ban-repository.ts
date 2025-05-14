export async function banUser(
  userId: string,
  types: string,
  reason: string,
  expiresAt: Date
) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/ban/user/${userId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        types,
        reason,
        expiresAt,
      }),
    }
  );
  if (!response.ok) {
    return response.json();
  }
}
export async function unbanUser(userId: string, types: string, unbanReason: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/ban/unban/user/${userId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        types,
        unbanReason,
      }),
    }
  );
  if (!response.ok) {
    return response.json();
  }
}
export async function getBanByUser(userId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/ban/user/${userId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    return response.json();
  }
  return response.json();
}
