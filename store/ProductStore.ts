import { create } from "zustand";
import {
  channelDataType,
  DataFileType,
  ProductStoreType,
  SingleProductType,
  AssetType,
} from "@/type/product-type";
import { DataItem } from "@/type/variation-type";

export const useProductStore = create<ProductStoreType>((set, get) => ({
  // product name | title
  title: null,
  setTitle(value) {
    set((state) => ({
      ...state,
      title: value,
    }));
  },

  // brand name
  brand: "",
  setBrandName(val) {
    set((state) => ({
      ...state,
      brand: val,
    }));
  },

  // Product descriptions
  description: null,
  setDescription(val) {
    set((state) => ({
      ...state,
      description: val,
    }));
  },

  // category selection
  categoryValue: null,
  setCategoryValue(val) {
    set((state) => ({
      ...state,
      categoryValue: val,
    }));
  },

  // Product type selections
  productTypeValue: null,
  setProductTypeValue(val) {
    set((state) => ({
      ...state,
      productTypeValue: val,
    }));
  },

  // skuId's set
  sku: null,
  setSku(val) {
    set((state) => ({
      ...state,
      sku: val,
    }));
  },

  // country of origin Selection
  countryOfOrigin: null,
  setCountryOfOrigin(val) {
    set((state) => ({
      ...state,
      countryOfOrigin: val,
    }));
  },

  // weight set
  weight: null,
  setWeight(val) {
    set((state) => ({
      ...state,
      weight: val,
    }));
  },

  // length set

  length: null,
  setLength(val) {
    set((state) => ({
      ...state,
      length: val,
    }));
  },

  // width set
  width: null,
  setWidth(val) {
    set((state) => ({
      ...state,
      width: val,
    }));
  },

  // height set
  height: null,
  setHeight(val) {
    set((state) => ({
      ...state,
      height: val,
    }));
  },

  // package details
  packageDetails: null,
  setPackageDetails(val) {
    set((state) => ({
      ...state,
      packageDetails: val,
    }));
  },

  // Inventory selection
  inventoryStrategy: "UNIFIED",
  setinventoryStrategy(value) {
    set((state) => ({
      ...state,
      inventoryStrategy: value,
    }));
  },

  // manufacture name
  manufactureName: "",
  setManufactureName(val) {
    set((state) => ({
      ...state,
      manufactureName: val,
    }));
  },

  // manufacture address
  manufactureAddress: "",
  setManufactureAddress(val) {
    set((state) => ({
      ...state,
      manufactureAddress: val,
    }));
  },

  // manufacture month
  manufactureMonth: "",
  setManufactureMonth(val) {
    set((state) => ({
      ...state,
      manufactureMonth: val,
    }));
  },
  // Variant enable
  isVariant: false,
  variantHandle: (value) => set((state) => ({ ...state, isVariant: value })),
  variantOpt: null,
  variantOptHandle: (value) =>
    set((state) => ({ ...state, variantOpt: value })),

  // product price
  productPrice: null,
  setProductPrice: (value) =>
    set((state) => ({ ...state, productPrice: value })),

  // ondcPrice
  ondcPrice: "",
  setOndcPrice(val) {
    set((state) => ({
      ...state,
      ondcPrice: val,
    }));
  },

  // defaultPrice
  defaultPrice: "",
  setDefaultPrice(val) {
    set((state) => ({
      ...state,
      defaultPrice: val,
    }));
  },

  // Hsn code
  hsnCode: null,
  setHsnCode(val) {
    set((state) => ({
      ...state,
      hsnCode: val,
    }));
  },

  // ean number
  eanNumberCode: null,
  setEanNumberCode(val) {
    set((state) => ({
      ...state,
      eanNumberCode: val,
    }));
  },

  // price same across all channel enable
  isPriceSameAllChannel: false,
  setPriceSameAllChannel: (value) =>
    set((state) => ({ ...state, isPriceSameAllChannel: value })),

  // inventory quantity
  productInventory: null,
  setProductInventory: (value) =>
    set((state) => ({ ...state, productInventory: value })),

  // variants
  productVariant: null,
  setProductVariant(val) {
    set((state) => ({
      ...state,
      productVariant: val,
    }));
  },

  // discounted price
  discountedPrice: null,
  setDiscountedPrice(val) {
    set((state) => ({
      ...state,
      discountedPrice: val,
    }));
  },

  // publish channel
  publishChannel: null,
  setPublishChannel(val: string | null | [], checked: boolean = false) {
    set((state) => {
      // If the publishChannel is null, treat it as an empty array
      let updatedList = state.publishChannel ? [...state.publishChannel] : [];

      if (val !== null) {
        if (checked) {
          // If checked is true, add val to the list
          updatedList.push(val as string);
        } else {
          // If checked is false, remove val from the list
          updatedList = updatedList.filter((channel) => channel !== val);
        }
      } else {
        updatedList = [];
      }

      // Return the new state with the updated publishChannel list
      return {
        ...state,
        publishChannel: updatedList.length > 0 ? updatedList : null, // If the list is empty, set it back to null
      };
    });
  },

  // product status
  productStatus: "",
  setProductStatus(val) {
    set((state) => ({
      ...state,
      productStatus: val,
    }));
  },

  // channel data publish
  channelData: null,
  setChannelData(
    val: channelDataType | null,
    removeChannelType: string | null = null,
  ) {
    set((state) => {
      let updatedChannelData: channelDataType[];

      if (removeChannelType) {
        updatedChannelData =
          state.channelData?.filter(
            (channel) => channel.channelType !== removeChannelType,
          ) || [];
      } else if (val) {
        updatedChannelData = state.channelData
          ? [...state.channelData, val]
          : [val];
      } else {
        updatedChannelData = [];
      }

      return {
        ...state,
        channelData: updatedChannelData,
      };
    });
  },
  // product assets
  productAssets: null,
  setProductAssets(assets: AssetType[] | DataFileType[]) {
    let productAssets: { assetId: string }[] = [];

    productAssets = assets.map((asset) => {
      // Check which type of asset we're dealing with
      if ("signedUrl" in asset) {
        // This is an AssetType
        return { assetId: asset.id };
      } else {
        // This is a DataFileType
        return { assetId: asset.id.toString() }; // Convert number to string
      }
    });

    set((state) => ({
      ...state,
      productAssets: productAssets,
    }));
  },

  // gender

  gender: null,
  setGender(val) {
    set((state) => ({
      ...state,
      gender: val,
    }));
  },

  // product type name set and extract from productTypeValue
  productTypeName: null,
  setProductTypeName(val) {
    set((state) => ({
      ...state,
      productTypeName: val,
    }));
  },

  // ondc metaData set
  ondcMetadata: null,
  setONDCMetadata(val) {
    set((state) => ({
      ...state,
      ondcMetadata: val,
    }));
  },

  // amazon metadata
  amazonMetadata: null,
  setAmazonMetadata(val) {
    set((state) => ({
      ...state,
      amazonMetadata: val,
    }));
  },

  // shopify metadata
  shopifyMetadata: null,
  setShopifyMetadata(val) {
    set((state) => ({
      ...state,
      shopifyMetadata: val,
    }));
  },

  // shopify extradata
  shopifyExtraData: null,
  setShopifyExtraData(val) {
    set((state) => ({
      ...state,
      shopifyExtraData: { ...val },
    }));
  },

  // extra data for ondc
  ondcExtraData: {},
  setOndcExtraData(val) {
    // const {
    //   hsnCode,
    //   title,
    //   description,
    //   countryOfOrigin,
    //   length,
    //   width,
    //   height,
    //   weight,
    //   discountedPrice,
    //   gender,
    //   manufactureAddress,
    //   manufactureMonth,
    //   manufactureName,
    // } = get();

    // const imagesList = productAssets?.map((asset) => asset.assetId);

    // const availableFieldsData: Record<string, string | number | string[]> = {
    //   productCode: hsnCode || "",
    //   productName: title || "",
    //   description: description || "",
    //   longDescription: description || "",
    //   countryOfOrigin: countryOfOrigin || "",
    //   maxAllowedQty: "",
    //   length: length || "",
    //   breadth: width || "",
    //   height: height || "",
    //   weight: weight || "",
    //   mrp: discountedPrice?.toString() || "",
    //   purchasePrice: "",
    //   quantity: "",
    //   images: [],
    //   backImage: "",
    //   gender: gender || "",
    //   colour: "",
    //   size: "",
    //   colourName: "",
    //   sizeChart: "",
    //   manufacturedDate: "",
    //   manufacturerName: "",
    //   manufacturerOrPackerName: manufactureName || "",
    //   manufacturerOrPackerAddress: manufactureAddress || "",
    //   monthOfManufactureOrPacking: manufactureMonth || "",
    // };

    set((state) => ({
      ...state,
      ondcExtraData: { ...val },
    }));
  },

  // extra data for amazon
  amazonExtraData: {},
  setAmazonExtraData(val) {
    set((state) => ({
      ...state,
      amazonExtraData: { ...val },
    }));
  },

  // data publish on channel
  channelPublishData() {
    const { productPrice, productVariant, productInventory } = get();
    let idCounter = 1;
    const productArray: DataItem[] = [];

    if (productVariant) {
      const sizeVariant = productVariant.find(
        (variant) => variant.variantName === "Size",
      );
      const colorVariant = productVariant.find(
        (variant) => variant.variantName === "Color",
      );

      if (sizeVariant && colorVariant) {
        for (const size of sizeVariant.values) {
          for (const color of colorVariant.values) {
            productArray.push({
              id: idCounter++,
              size: size.label || "",
              color: color.label || "",
              quantity: productInventory
                ? parseInt(productInventory as string)
                : 0,
              ondcPrice: parseFloat((productPrice as string) || "0") || 0,
              defaultPrice: parseFloat((productPrice as string) || "0") || 0,
            });
          }
        }
      }
    }

    return productArray;
  },

  // single product fetch data for edit
  singleProductData: {} as SingleProductType,
  setSingleProductData(val) {
    set((state) => ({
      ...state,
      singleProductData: val,
    }));
  },

  // error state
  productListError: null,
  setProductListError(val) {
    set((state) => ({
      ...state,
      productListError: { ...val },
    }));
  },

  // ennabled channels
  enabledChannels: ["AMAZON", "WIX", "WOO-COMMERCE", "ONDC", "SHOPIFY"],
  setEnabledChannels(val) {
    set((state) => ({
      ...state,
      enabledChannels: val,
    }));
  },
}));
