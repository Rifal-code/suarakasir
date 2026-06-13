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
