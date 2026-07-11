export const BASE_URL = "";

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
  }
};

export const logoutBackend = async () => {
  try {
    // Attempt to hit the backend logout endpoint
    await fetchApi("/api/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Backend logout error:", error);
  } finally {
    // Always remove token in frontend regardless of backend success
    removeAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
};

export const getUserName = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("user_name") || "Kasir Utama";
  }
  return "Kasir Utama";
};

export const setUserName = (name: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_name", name);
  }
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Cast options.headers to a Record if it exists to allow spreading and indexing
  const baseHeaders = (options.headers as Record<string, string>) || {};
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...baseHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (response.status === 401) {
    // Token might be expired or invalid
    removeAuthToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }


  return { response, data };
};

export const parseVoiceOrder = async (items: {n: string, q: number}[]) => {
  return fetchApi("/api/ai/parse-order", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
};

export const swrFetcher = async (url: string) => {
  const { response, data } = await fetchApi(url);
  if (!response.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch data");
  }
  return data;
};

export const submitFeedback = async (message: string, is_public: boolean) => {
  return fetchApi("/api/feedback", {
    method: "POST",
    body: JSON.stringify({ message, is_public }),
  });
};

export const getPublicFeedbacks = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/api/feedback?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return { response, data };
};

export const getFeedbackDetail = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/feedback/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return { response, data };
};

export const getUserFeedbacks = async (page = 1, limit = 10) => {
  return fetchApi(`/api/feedback/me?page=${page}&limit=${limit}`, {
    method: "GET",
  });
};

export const updateFeedback = async (id: string, message?: string, is_public?: boolean) => {
  const body: any = {};
  if (message !== undefined) body.message = message;
  if (is_public !== undefined) body.is_public = is_public;

  return fetchApi(`/api/feedback/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

export const deleteFeedback = async (id: string) => {
  return fetchApi(`/api/feedback/${id}`, {
    method: "DELETE",
  });
};
