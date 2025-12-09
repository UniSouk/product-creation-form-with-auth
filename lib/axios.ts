import { getAccessToken, getRefreshToken, getStoreId, removeAllCookies } from "./cookies";

let accessToken: string | null = getAccessToken() || null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "/api";

async function requestInterceptor(config) {
  const accessToken = getAccessToken();
  const storeId = getStoreId();

  config.headers = {
    ...config.headers,
    "Content-Type": "application/json",
  };

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (storeId) {
    config.headers["x-store-id"] = storeId;
  }

  return config;
}

async function responseInterceptor(response, config) {
  // Same as your axios responseConfig — return response as is
  return response;
}

let refreshTokenPromise: Promise<string> | null = null;

export const refreshTokenSingleton = async () => {
  // If refresh already in progress → return same promise
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  const refreshToken = getRefreshToken();
  const storeId = getStoreId();

  refreshTokenPromise = fetch(`/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-store-id": storeId || "",
    },
    body: JSON.stringify({
      refreshToken,
      storeId,
    }),
    credentials: "include",
  })
    .then(async (res) => {
      const response = await res.json();

      const newAccessToken = response?.data?.accessToken;
      setAccessToken(newAccessToken);

      return newAccessToken;
    })
    .finally(() => {
      refreshTokenPromise = null;
    });

  return refreshTokenPromise;
};


async function responseErrorInterceptor(error, config) {
  if (error.status === 401 && !config._retry) {
    config._retry = true;

    try {
      const newAccessToken = await refreshTokenSingleton();

      config.headers.Authorization = `Bearer ${newAccessToken}`;

      // retry original request
      return api.request(config);
    } catch (refreshError) {
      const pathname = window.location.pathname;

      if (pathname.indexOf("/auth/") !== 0) {
        removeAllCookies();
        window.location.href = "/auth/login";
      }

      throw refreshError;
    }
  }

  throw error;
}

async function callFetch(config) {
  const { url, method, body, headers } = config;

  const response = await fetch(`${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  // Try to parse JSON
  let data = null;
  try {
    data = await response.json();
  } catch {}

  const result = { ok: response.ok, status: response.status, data };

  if (!response.ok) {
    await responseErrorInterceptor({ status: response.status, data }, config);
  }

  return responseInterceptor(result, config);
}

export const api = {
  async request(config) {
    const finalConfig = await requestInterceptor(config);
    return callFetch(finalConfig);
  },

  get(url, headers = {}) {
    return this.request({ url, method: "GET", headers });
  },

  post(url, body, headers = {}) {
    return this.request({ url, method: "POST", body, headers });
  },

  put(url, body, headers = {}) {
    return this.request({ url, method: "PUT", body, headers });
  },

  delete(url, headers = {}) {
    return this.request({ url, method: "DELETE", headers });
  },
};
