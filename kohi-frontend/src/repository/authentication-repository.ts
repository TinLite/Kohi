export async function login(email: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
      credentials: "include",
    }
  );
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }
    throw new Error(await response.text());
  }
  return true;
}
export async function resetPassword(email: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/auth/reset-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error(await response.text());
  return true;
}

export async function logout() {
  return fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );
}

export async function register(data: {
  displayName?: string;
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/users/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error("Email hoặc mật khẩu không chính xác");
}

export async function getUserId() {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/auth/profile`,
    {
      credentials: "include",
    }
  );
  if (response.ok) {
    console.log("OK", response);
    return (await response.json())["_id"];
  } else {
    throw new Error(await response.text());
  }
}
export async function verifyEmail(email: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/auth/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error(await response.text());
  return true;
}
export async function verifyCode(email: string, code: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/${
      import.meta.env.VITE_API_PREFIX
    }/auth/email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
      credentials: "include",
    }
  );
  if (!response.ok) throw new Error(await response.text());
  return true;
}
