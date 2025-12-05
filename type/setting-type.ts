import {  z } from "zod";

export type AccountType = "credential" | "oauth";

export type StoreDetailsType = {
  storeName: string;
  storeDescription: string;
  email: string;
  mobile: string;
  billingAddress: string;

  // pickupAddress: string;

  city: string;
  pincode: string;

  // country: string;
  state: string;

  pickupCity: string;
  pickupPincode: string;
  pickupBuilding: string;

  billingBuilding:string;
  // country: string;
  pickupState: string;
};

type BillingAddress = {
  address: string;
  city: string;
  pincode: number;
  state: string;
  country: string;
  building:string
};

type PickupAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: number;
  state: string;
  country: string;
  lat?: number;
  long?: number;
  building: string;
};

export type PickupAddressType = {
  building: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
};

export type StoreDetailsPayloadType = {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  image?: string;
  billingAddress: BillingAddress;
  pickupAddress: PickupAddress;
  inventoryStrategy?: string;
  id?: string;
};



export type ProfileDetailsType = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
};

export type ProfileDetailsPayloadType = {
  userId: string;
  firstName: string;
  lastName: string;
  // email: string;
  phone: string;
  image?: string;
};

export type ErrorResponse = {
  error: string;
  message: string;
  path: string;
  requestId: string;
  statusCode: number;
  timestamp: number;
};


export type StoreData = {
  title: string;
  description: string;
  email: string;
  phone?: string;
  city?: string;
  pincode?: string;
  id: string;
  inventoryStrategy: string;
  enabledChannels: string[];
  billingAddress?: {
    address?: string;
    pincode?: number;
    city: string;
    state: string;
    country: string;
    building: string;
  };
  pickupAddress?: {
    address?: string;
    lat?: number;
    long?: number;
    pincode?: number;
    city: string;
    state: string;
    country: string;
    building: string;
  };
  signedUrl?: string;
  image?: string;
  isBillingsame:boolean
};