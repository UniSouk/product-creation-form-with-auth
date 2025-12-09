import Cookies from "js-cookie";
import { setAccessToken } from "./axios";

export const setEmail = (email: string) => {
  Cookies.set("email", email, { expires: 7 });
};
export const getEmail = () => Cookies.get("email");

export const setToken = (token: string) => {
  // Cookies.set("token", token, { expires: 7 });
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
}
export const getToken = () => Cookies.get("token");

export const setStoreId = (storeId: string) => {
  // const prevStoreId = getStoreId();
  Cookies.set("storeId", storeId, { expires: 7 });
};

export const getStoreId = () =>{ return Cookies.get("storeId")};

export const getAccessToken = () => {
  return Cookies.get("accessToken");
};
// export const getStoreId = () => {
//   const storeId = "store_Vc3PvYOQrna9GOF7";
//   return storeId;
// };

export const removeAllCookies = () => {
  Cookies.remove("token");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("storeId");
  Cookies.remove("inventoryStrategy");
  setAccessToken(null);
};

// export const getCreateFirstOrder = () => Cookies.get("createFirstOrder");

// export const setCreateFirstOrder = (dashboardAnalytics: "true" | "false") => {
//   Cookies.set("createFirstOrder", dashboardAnalytics, {
//     expires: 365, // 1 year
//     secure: true, // Required for HTTPS
//     sameSite: "None", // Ensures cookies persist properly across domains
//   });
// };

export const getCreateFirstOrder = () =>
  localStorage.getItem("createFirstOrder");

export const setCreateFirstOrder = (dashboardAnalytics: "true" | "false") => {
  localStorage.setItem("createFirstOrder", dashboardAnalytics);
};

