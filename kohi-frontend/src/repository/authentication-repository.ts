export async function login(email: string, password: string) {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });
  if (response.ok) {
    const data = await response.json();
    localStorage.backend_access_token = data.access_token;
  } else {
    throw new Error(await response.text());
  }
}

export async function getUserId() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_API_PREFIX}/auth/profile`, {
        headers: {
        Authorization: `Bearer ${localStorage.backend_access_token}`,
        },
    });
    if (response.ok) {
        console.log("OK", response);
        return (await response.json())["_id"];
    } else {
        throw new Error(await response.text());
    }
}