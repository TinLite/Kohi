export async function getAllNotifications() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/notifications/all`,
    {
      method: "GET",
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }
  const data = await response.json();
 console.log(data);
  return data;
}

export async function readNotification(id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/notifications/read/${id}`,
    {
      method: "POST",
      credentials: 'include',
    }
  );
  if (!response.ok) {
    throw new Error("Failed to read notifications");
  }
}
  export async function deleteNotification(id:string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/${
        import.meta.env.VITE_API_PREFIX
      }/notifications/delete/${id}`,
      {
        method: "DELETE",
        credentials: 'include',
      }
    );
    if (!response.ok) {
      return response.json();
    }
  }

