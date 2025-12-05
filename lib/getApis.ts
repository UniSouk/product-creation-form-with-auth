import { api } from "./axios";
import { StoreData } from "../type/setting-type"
// import { getStoreId } from "./cookies";

export const fetchStoreDetails = async () => {
  const res = await api.get(`/store/settings`);
  return res.data.data as StoreData;
};

// export const fetchStoreDetails = async () => {
//   const res = await coreApi.get(`/store`);
//   // return res.data;
//   const data = res.data.data;
//   const storeId = getStoreId();
//   return data.find((item: any) => item.id === storeId);
// };
