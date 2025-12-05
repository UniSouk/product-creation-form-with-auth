
import { Variant } from "@/component/ProductVariants";
import { DataItem } from "./variation-type";
import { ONDCMetadata, ShopifyMatadata } from "@/component/ProductFormDescription";
import {
  FormattedOption,
  VariantData,
  VariationOption,
} from "@/utils/singleProductDataConverter";

export type ProductAssetType = "IMAGE" | "VIDEO";

export type FileAssetType = {
  fileName: string;
  fileType: ProductAssetType;
  mimeType: string;
  fileSize: number;
  position: number;
};

export type CreateAssetType = {
  assets: FileAssetType[];
};

export type AssetPayloadType = {
  assetId: string;
  position: number;
};

export type UpdateAssetType = {
  productAssets: {
    productId: string;
    assets: AssetPayloadType[];
  };
};

export type DataFileType = {
  id: string;
  assetUrl: string;
  file?: File;
  fileType: ProductAssetType;
  metadata: {
    mimeType: string;
  };
};

export type AssetType = {
  id: string;
  fileName: string;
  signedUrl: string;
};

export type ProductPayloadType = {
  brandName: string;
  manufacturingInfo: {
    manufacturerOrPackerName: string;
    manufacturerOrPackerAddress: string;
    monthOfManufactureOrPacking: string;
  };
  title: string;
  description: string;
  inventoryStrategy: string;
  priceStrategy: string;
  hsnCode: string;
  categoryId: string;
  subCategoryId?: string;
  packageDetails: Packagedetails | null;
  originCountry: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variants: any;
  productAssets: { assetId: string }[];
};

export type UnitValue = {
  value: number | string;
  unit: string;
};

export type PackageDimensionType = {
  weight: UnitValue;
  length: UnitValue;
  width: UnitValue;
  height: UnitValue;
};

export type Packagedetails = {
  dimensions: PackageDimensionType;
};

export type AmazonMetaData = {
  productType: string;
};

export type ProductListErrorType = {
  title?: string | undefined;
  brand?: string | undefined;
  category?: string | undefined;
  countryOfOriginerrs?: string | undefined;
  description?: string | undefined;
  discountedPrice?: string | undefined;
  height?: string | undefined;
  hsnCode?: string | undefined;
  eanNumber?: string | undefined;
  length?: string | undefined;
  productPriceError?: string | undefined;
  productInventoryErrsMsg?: string | undefined;
  sku?: string | undefined;
  weight?: string | undefined;
  productType?: string | undefined;
  width?: string | undefined;
  status?: string | undefined;
  productImage?: string | undefined;
  gender?: string | undefined;
  channelPublishing?: string | undefined;
  ondcPrice?: string | undefined;
  amazonPrice?: string | undefined;
  amazonInventory?: string | undefined;
  wooCommercePrice?: string | undefined;
  wooCommerceInventory?: string | undefined;
  shopifyPrice?: string | undefined;
  shopifyInventory?: string | undefined;
  wixPrice?: string | undefined;
  wixInventory?: string | undefined;
  defaultPrice?: string | undefined;
  ondcInventory?: string | undefined;
  defaultInventory?: string | undefined;
  manufactureName?: string | undefined;
  manufactureAddress?: string | undefined;
  manufactureMonth?: string | undefined;
};

export type channelDataType = {
  channelType: string;
  price: number;
  quantity: number;
  mrp: number;
};

export interface SingleProductType {
  id: string;
  type: string;
  title: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  originCountry: string;
  status?: string;
  gender?: string;
  discountedPrice?: number;
  productPrice?: number;
  sizeVariant?: FormattedOption[];
  colorVariant: FormattedOption[];
  variation?: VariationOption[];
  assets?: DataFileType[];
  heightDimensions?: UnitValue;
  widthDimensions?: UnitValue;
  weightDimensions?: UnitValue;
  lengthDimensions?: UnitValue;
  publishChannel?: string[];
  ondcInventoryData?: { quantity: number; price: number };
  defaultInventoryData?: { quantity: number; price: number };
  amazonInventoryData?: { quantity: number; price: number };
  wooCommerceInventoryData?: { quantity: number; price: number };
  shopifyInventoryData?: {
    quantity: number;
    price: number;
  };
  wixInventoryData?: {
    quantity: number;
    price: number;
  };
  channelData?: channelDataType[];
  variants?: VariantData[];
  extraData?: {
    ondc: Record<string, any>;
    amazon: Record<string, any>;
    shopify: Record<string, any>;
  };
  variationAttribute?: string[];
  brandName?: string;
  inventory?: number;
  eanNumber?: string;
  manufacturingInfo?: {
    manufacturerOrPackerName: string;
    manufacturerOrPackerAddress: string;
    monthOfManufactureOrPacking: string;
  };
}

export type ProductStoreType = {
  title: string | null;
  setTitle: (val: string | null) => void;
  brand: string | undefined;
  setBrandName: (val: string) => void;
  description: string | null;
  setDescription: (val: string | null) => void;
  categoryValue: string | null;
  setCategoryValue: (val: string | null) => void;
  productTypeValue: string | null;
  setProductTypeValue: (val: string | null) => void;
  sku: string | null;
  setSku: (val: string | null) => void;
  countryOfOrigin: null | string;
  setCountryOfOrigin: (val: string | null) => void;
  weight: null | number | string;
  setWeight: (val: number | null | string) => void;
  length: null | number | string;
  setLength: (val: number | null | string) => void;
  width: null | number | string;
  setWidth: (val: number | null | string) => void;
  height: null | number | string;
  setHeight: (val: number | null | string) => void;
  packageDetails: Packagedetails | null;
  setPackageDetails: (val: Packagedetails | null) => void;
  inventoryStrategy: string | null;
  setinventoryStrategy: (value: string | null) => void;
  isVariant: boolean;
  variantHandle: (value: boolean) => void;
  variantOpt: string | null;
  variantOptHandle: (value: string) => void;
  productPrice: number | null | string;
  setProductPrice: (val: number | null | string) => void;
  discountedPrice: null | number | string;
  setDiscountedPrice: (val: number | null | string) => void;
  hsnCode: null | string | undefined;
  setHsnCode: (val: string | null) => void;
  eanNumberCode: null | string | undefined;
  setEanNumberCode: (val: string) => void;
  isPriceSameAllChannel: boolean;
  setPriceSameAllChannel: (val: boolean) => void;
  productInventory: number | null | string;
  setProductInventory: (val: number | null | string) => void;
  productVariant: Variant[] | null;
  setProductVariant: (val: Variant[]) => void;
  channelPublishData: () => DataItem[];
  publishChannel: null | string[];
  setPublishChannel: (val: string | null, checked?: boolean) => void;
  productStatus: null | string;
  setProductStatus: (val: string | null) => void;
  gender: string | null;
  setGender: (val: string | null) => void;
  productListError: null | ProductListErrorType;
  setProductListError: (val: object) => void;
  channelData: null | channelDataType[];
  setChannelData: (
    val: channelDataType | null,
    removeChannel?: string | null,
  ) => void;
  productAssets: null | { assetId: string }[];
  setProductAssets: (val: AssetType[] | DataFileType[]) => void;
  productTypeName: string | null;
  setProductTypeName: (val: string) => void;
  ondcPrice: number | string;
  setOndcPrice: (val: number | string) => void;
  defaultPrice: number | string;
  setDefaultPrice: (val: string | number) => void;
  ondcMetadata: ONDCMetadata | null;
  setONDCMetadata: (val: ONDCMetadata) => void;
  amazonMetadata: AmazonMetaData | null;
  setAmazonMetadata: (val: AmazonMetaData) => void;
  shopifyMetadata: ShopifyMatadata | null;
  setShopifyMetadata: (val: ShopifyMatadata) => void;
  singleProductData: SingleProductType;
  setSingleProductData: (val: SingleProductType) => void;
  ondcExtraData: Record<string, string | number | string[]> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOndcExtraData: (val: Record<string, any>) => void;
  amazonExtraData: Record<string, string | number | string[]> | null;
  setAmazonExtraData: (val: Record<string, any>) => void;
  shopifyExtraData: Record<string, string | number | string[]> | null;
  setShopifyExtraData: (val: Record<string, any>) => void;
  manufactureName: string | null;
  setManufactureName: (val: string) => void;
  manufactureAddress: string | null;
  setManufactureAddress: (val: string) => void;
  manufactureMonth: string | null;
  setManufactureMonth: (val: string) => void;
  enabledChannels: string[];
  setEnabledChannels: (val: string[]) => void;
};
