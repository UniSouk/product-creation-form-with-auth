import useVariationStore from "@/store/VariationStore";
import InputCheckbox from "@/ui/InputCheckbox";
import InputComp from "@/ui/InputComp";
import InputWithLabel from "@/ui/InputWithLabel";
import LabelComp from "@/ui/LabelComp";
import RupeeIcon from "@/assets/icons/RupeeTcon";
import { useProductStore } from "@/store/ProductStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { channelDataType, ProductListErrorType } from "@/type/product-type";

type VariantsPriceType = {
  ondcPrice?: number;
  defaultPrice?: number;
  amazonPrice?: number;
  amazonInventory?: number;
  ondcInventory?: number;
  defaultInventory?: number;
  wooCommercePrice?: number;
  wooCommerceInventory?: number;
  shopifyInventory?: number;
  shopifyPrice?: number;
  wixInventory?: number;
  wixPrice?: number;
};

const distributeInventory = (total: number, connectedChannel: number) => {
  const base = Math.floor(total / connectedChannel);
  const remainder = total % connectedChannel;

  return Array.from({ length: connectedChannel }, (_, i) =>
    i === connectedChannel - 1 ? base + remainder : base
  );
};

function ChannelPublishingBasics() {
  const {
    watch,
    register,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
  } = useForm<VariantsPriceType>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [newChannelData, setNewChannelData] = useState<channelDataType[]>([]);
  const [isInventoryDisable, setisInventoryDisable] = useState(true);

  const {
    inventoryStrategy,
    setPublishChannel,
    productListError,
    setProductListError,
    setChannelData,
    productInventory,
    channelData,
    productPrice,
    discountedPrice,
    publishChannel,
    isPriceSameAllChannel,
    singleProductData,
    enabledChannels,
    eanNumberCode,
  } = useProductStore();

  const { setVariants, variants, setUpdatedVariants } = useVariationStore();

  // Watch specific form fields instead of entire form
  const ondcPrice = watch("ondcPrice");
  const defaultPrice = watch("defaultPrice");
  const amazonPrice = watch("amazonPrice");
  const amazonInventory = watch("amazonInventory");
  const ondcInventory = watch("ondcInventory");
  const defaultInventory = watch("defaultInventory");
  const wooCommerceInventory = watch("wooCommerceInventory");
  const wooCommercePrice = watch("wooCommercePrice");
  const shopifyInventory = watch("shopifyInventory");
  const shopifyPrice = watch("shopifyPrice");
  const wixInventory = watch("wixInventory");
  const wixPrice = watch("wixPrice");

  useEffect(() => {
    setVariants();
  }, [channelData, setVariants]);

  useEffect(() => {
    setisInventoryDisable(inventoryStrategy === "UNIFIED");
  }, [inventoryStrategy]);

  useEffect(() => {
    if (inventoryStrategy === "UNIFIED") {
      setValue("ondcInventory", productInventory as number);
      setValue("defaultInventory", productInventory as number);
      setValue("amazonInventory", productInventory as number);
      setValue("wooCommerceInventory", productInventory as number);
      setValue("shopifyInventory", productInventory as number);
      setValue("wixInventory", productInventory as number);
    }
  }, [productInventory, inventoryStrategy, setValue]);

  useEffect(() => {
    if (isPriceSameAllChannel && productPrice) {
      setValue("ondcPrice", productPrice as number);
      setValue("defaultPrice", productPrice as number);
      setValue("amazonPrice", productPrice as number);
      setValue("wooCommercePrice", productPrice as number);
      setValue("shopifyPrice", productPrice as number);
      setValue("wixPrice", productPrice as number);
      trigger([
        "ondcPrice",
        "defaultPrice",
        "amazonPrice",
        "wooCommercePrice",
        "shopifyPrice",
        "wixPrice",
      ]);
    }
  }, [isPriceSameAllChannel, productPrice, setValue, trigger]);

  // This will update the EAN number in all variants when the main EAN changes

  useEffect(() => {
    if (eanNumberCode && variants.length > 0) {
      const updatedVariantsWithEan = variants.map((variant: any) => {
        return {
          ...variant,
          externalProductId: {
            type: "EAN",
            value: eanNumberCode,
          },
        };
      });

      setUpdatedVariants(updatedVariantsWithEan);
    }
  }, [eanNumberCode, variants, setUpdatedVariants]);

  // Channel publishing error handling with optimized dependency array
  useEffect(() => {
    if (publishChannel && publishChannel.length > 0) {
      const errorPublishingChannel: ProductListErrorType = {
        channelPublishing: undefined,
      };

      if (publishChannel.includes("ONDC")) {
        if (!ondcPrice) {
          setValue("ondcPrice", undefined);
        }
        if (inventoryStrategy === "UNIFIED") {
          trigger("ondcPrice");
        } else {
          if (!ondcInventory) {
            setValue("ondcInventory", undefined);
          }
          trigger(["ondcPrice", "ondcInventory"]);
        }
      }

      if (publishChannel.includes("DEFAULT")) {
        if (!defaultPrice) {
          setValue("defaultPrice", undefined);
        }
        if (inventoryStrategy === "UNIFIED") {
          trigger("defaultPrice");
        } else {
          if (!defaultInventory) {
            setValue("defaultInventory", undefined);
          }
          trigger(["defaultPrice", "defaultInventory"]);
        }
      }

      if (publishChannel.includes("AMAZON")) {
        if (!amazonPrice) {
          setValue("amazonPrice", undefined);
        }
        if (inventoryStrategy === "UNIFIED") {
          trigger("amazonPrice");
        } else {
          if (!amazonInventory) {
            setValue("amazonInventory", undefined);
          }
          trigger(["amazonPrice", "amazonInventory"]);
        }
      }

      if (publishChannel.includes("WOOCOMMERCE")) {
        if (!wooCommercePrice) {
          setValue("wooCommercePrice", undefined);
        }
        if (inventoryStrategy === "UNIFIED") {
          trigger("wooCommercePrice");
        } else {
          if (!wooCommerceInventory) {
            setValue("wooCommerceInventory", undefined);
          }
          trigger(["wooCommercePrice", "wooCommerceInventory"]);
        }
      }

      if (publishChannel.includes("SHOPIFY")) {
        if (!shopifyPrice) {
          setValue("shopifyPrice", undefined);
        }
        if (inventoryStrategy === "UNIFIED") {
          trigger("shopifyPrice");
        } else {
          if (!shopifyInventory) {
            setValue("shopifyInventory", undefined);
          }
          trigger(["shopifyPrice", "shopifyInventory"]);
        }
      }

      if (publishChannel.includes("WIX")) {
        if (!wixPrice) {
          setValue("wixPrice", undefined);
        }
        if (inventoryStrategy === "UNIFIED") {
          trigger("wixPrice");
        } else {
          if (!wixInventory) {
            setValue("wixInventory", undefined);
          }
          trigger(["wixPrice", "wixPrice"]);
        }
      }

      setProductListError({
        ...productListError,
        ...errorPublishingChannel,
      });
    }
  }, [
    publishChannel,
    ondcPrice,
    amazonPrice,
    amazonInventory,
    ondcInventory,
    defaultInventory,
    inventoryStrategy,
    defaultPrice,
    wooCommerceInventory,
    wooCommercePrice,
    shopifyInventory,
    shopifyPrice,
    wixInventory,
    wixPrice,
    setValue,
    trigger,
    setProductListError,
  ]);

  // Optimized inventory error handling
  useEffect(() => {
    if (inventoryStrategy !== "UNIFIED") {
      const errorInventoryCheck = {
        ondcInventory: publishChannel?.includes("ONDC")
          ? errors.ondcInventory?.message
          : undefined,
        defaultInventory: publishChannel?.includes("DEFAULT")
          ? errors.defaultInventory?.message
          : undefined,
        amazonInventory: publishChannel?.includes("AMAZON")
          ? errors.amazonInventory?.message
          : undefined,
        wooCommerceInventory: publishChannel?.includes("WOOCOMMERCE")
          ? errors.wooCommerceInventory?.message
          : undefined,
        shopifyInventory: publishChannel?.includes("SHOPIFY")
          ? errors.shopifyInventory?.message
          : undefined,
        wixInventory: publishChannel?.includes("WIX")
          ? errors.wixInventory?.message
          : undefined,
      };
      setProductListError({
        ...productListError,
        ...errorInventoryCheck,
      });
    } else {
      const errorInventoryCheck = {
        ondcInventory: undefined,
        defaultInventory: undefined,
        amazonInventory: undefined,
        wooCommerceInventory: undefined,
        shopifyInventory: undefined,
        wixInventory: undefined,
      };

      setProductListError({
        ...productListError,
        ...errorInventoryCheck,
      });
    }
  }, [
    errors.ondcInventory,
    errors.defaultInventory,
    errors.amazonInventory,
    errors.wooCommerceInventory,
    errors.shopifyInventory,
    errors.wixInventory,
    inventoryStrategy,
    publishChannel,
    setProductListError,
  ]);

  useEffect(() => {
    if (!isInventoryDisable) {
      const errorInventoryCheck = {
        ondcInventory: errors.ondcInventory?.message,
        defaultInventory: errors.defaultInventory?.message,
        amazonInventory: errors.amazonInventory?.message,
        wooCommerceInventory: errors.wooCommerceInventory?.message,
        shopifyInventory: errors.shopifyInventory?.message,
        wixInventory: errors.wixInventory?.message,
      };
      setProductListError({
        ...productListError,
        ...errorInventoryCheck,
      });
    }
  }, [
    errors.ondcInventory,
    errors.defaultInventory,
    errors.amazonInventory,
    errors.wooCommerceInventory,
    errors.shopifyInventory,
    errors.wixInventory,
    isInventoryDisable,
    setProductListError,
  ]);

  useEffect(() => {
    const errorOndcPrice = {
      ondcPrice: errors.ondcPrice?.message,
    };
    setProductListError({
      ...productListError,
      ...errorOndcPrice,
    });
  }, [errors.ondcPrice, setProductListError]);

  useEffect(() => {
    const errorAmazonPrice = {
      amazonPrice: errors.amazonPrice?.message,
    };
    setProductListError({
      ...productListError,
      ...errorAmazonPrice,
    });
  }, [errors.amazonPrice, setProductListError]);

  useEffect(() => {
    const errorWooCommercePrice = {
      wooCommercePrice: errors.wooCommercePrice?.message,
    };
    setProductListError({
      ...productListError,
      ...errorWooCommercePrice,
    });
  }, [errors.wooCommercePrice, setProductListError]);

  useEffect(() => {
    const errorShopifyPrice = {
      shopifyPrice: errors.shopifyPrice?.message,
    };
    setProductListError({
      ...productListError,
      ...errorShopifyPrice,
    });
  }, [errors.shopifyPrice, setProductListError]);

  useEffect(() => {
    const errorWixPrice = {
      wixPrice: errors.wixPrice?.message,
    };
    setProductListError({
      ...productListError,
      ...errorWixPrice,
    });
  }, [errors.wixPrice, setProductListError]);

  useEffect(() => {
    // Only proceed if publish channels are selected
    if (!publishChannel || publishChannel.length === 0) return;

    const errors: ProductListErrorType = {};

    // Validate ONDC Price if ONDC channel is selected
    if (publishChannel.includes("ONDC") && ondcPrice) {
      if (Number(ondcPrice) >= (discountedPrice as number)) {
        errors.ondcPrice = "Price must be less than compare price";
        // Manually trigger validation for ondcPrice
        trigger("ondcPrice");
      }
    }

    // Validate Default Price if Default channel is selected
    if (publishChannel.includes("DEFAULT") && defaultPrice) {
      if (Number(defaultPrice) >= (discountedPrice as number)) {
        errors.defaultPrice = "Price must be less than compare price";
        // Manually trigger validation for defaultPrice
        trigger("defaultPrice");
      }
    }

    // Validate amazon Price if amazon channel is selected
    if (publishChannel.includes("AMAZON") && amazonPrice) {
      if (Number(amazonPrice) >= (discountedPrice as number)) {
        errors.amazonPrice = "Price must be less than compare price";
        // Manually trigger validation for defaultPrice
        trigger("amazonPrice");
      }
    }

    // Validate woocommerce Price if woocommerce channel is selected
    if (publishChannel.includes("WOOCOMMERCE") && wooCommercePrice) {
      if (Number(wooCommercePrice) >= (discountedPrice as number)) {
        errors.wooCommercePrice = "Price must be less than compare price";
        // Manually trigger validation for defaultPrice
        trigger("wooCommercePrice");
      }
    }

    // Validate shopify Price if shopify channel is selected
    if (publishChannel.includes("SHOPIFY") && shopifyPrice) {
      if (Number(shopifyPrice) >= (discountedPrice as number)) {
        errors.shopifyPrice = "Price must be less than compare price";
        // Manually trigger validation for defaultPrice
        trigger("shopifyPrice");
      }
    }

    // Validate wix Price if wix channel is selected
    if (publishChannel.includes("WIX") && wixPrice) {
      if (Number(wixPrice) >= (discountedPrice as number)) {
        errors.wixPrice = "Price must be less than compare price";
        // Manually trigger validation for defaultPrice
        trigger("wixPrice");
      }
    }

    // Update product list errors if any errors found
    if (Object.keys(errors).length > 0) {
      setProductListError({
        ...productListError,
        ...errors,
      });
    }
  }, [
    discountedPrice,
    ondcPrice,
    defaultPrice,
    amazonPrice,
    wooCommercePrice,
    shopifyPrice,
    wixPrice,
    publishChannel,
    trigger,
    setProductListError,
  ]);

  // Optimized channelData updates
  useEffect(() => {
    if (!channelData) return;

    const inventories = distributeInventory(
      Number(productInventory || 0),
      publishChannel?.length || 1
    );

    const updatedChannelData = channelData.map((data, index) => {
      const unifiedQty = inventories[index];
      const price = Number(
        isPriceSameAllChannel
          ? productPrice
          : data.channelType === "ONDC"
            ? ondcPrice
            : data.channelType === "AMAZON"
              ? amazonPrice
              : data.channelType === "WOOCOMMERCE"
                ? wooCommercePrice
                : data.channelType === "SHOPIFY"
                  ? shopifyPrice
                  : data.channelType === "WIX"
                    ? wixPrice
                    : defaultPrice,
      );

      switch (data.channelType) {
        case "ONDC":
          return {
            ...data,
            mrp: discountedPrice as number,
            price: price || data.price,
            quantity:
              inventoryStrategy === "UNIFIED"
                ? unifiedQty
                : Number(ondcInventory),
          };
        case "DEFAULT":
          return {
            ...data,
            mrp: discountedPrice as number,
            price: price || data.price,
            quantity:
              inventoryStrategy === "UNIFIED"
                ? unifiedQty
                : Number(defaultInventory),
          };
        case "AMAZON":
        case "AMAZON_IN":
          return {
            ...data,
            channelType: "AMAZON_IN",
            mrp: discountedPrice as number,
            price: price || data.price,
            quantity:
              inventoryStrategy === "UNIFIED"
                ? unifiedQty
                : Number(amazonInventory),
          };
        case "WOOCOMMERCE":
          return {
            ...data,
            channelType: "WOOCOMMERCE",
            mrp: discountedPrice as number,
            price: price || data.price,
            quantity:
              inventoryStrategy === "UNIFIED"
                ? unifiedQty
                : Number(wooCommerceInventory),
          };
        case "SHOPIFY":
          return {
            ...data,
            channelType: "SHOPIFY",
            mrp: discountedPrice as number,
            price: price || data.price,
            quantity:
              inventoryStrategy === "UNIFIED"
                ? unifiedQty
                : Number(shopifyInventory),
          };

          case "WIX":
          return {
            ...data,
            channelType: "WIX",
            mrp: discountedPrice as number,
            price: price || data.price,
            quantity:
              inventoryStrategy === "UNIFIED"
                ? unifiedQty
                : Number(wixInventory),
          };
        default:
          return data;
      }
    });

    const uniqueChannelData = Array.from(
      new Map(updatedChannelData.map(item => [item.channelType, item])).values()
    );
    setNewChannelData(uniqueChannelData);
  }, [
    channelData,
    ondcPrice,
    defaultPrice,
    amazonPrice,
    wooCommercePrice,
    wooCommerceInventory,
    shopifyInventory,
    shopifyPrice,
    wixInventory,
    wixPrice,
    amazonInventory,
    ondcInventory,
    defaultInventory,
    productInventory,
    discountedPrice,
    isPriceSameAllChannel,
    productPrice,
    inventoryStrategy,
    publishChannel?.length,
  ]);

  useEffect(() => {
    const updateVariant = variants.map((variant: any, index: number) => {
      const baseVariant = {
        ...variant,
        variantAssets: (variant as any).assets || [],
        channelData: newChannelData,
      };

      // Add variantId if singleProductData.variants exists and has matching index
      if (singleProductData.variants?.[index]?.id) {
        return {
          ...baseVariant,
          variantId: singleProductData.variants[index].id,
        };
      }

      return baseVariant;
    });

    setUpdatedVariants(updateVariant);
  }, [
    newChannelData,
    variants,
    setUpdatedVariants,
    singleProductData.variants,
  ]);

  // Updated toggleCheckbox function to clear input values and errors
  const toggleCheckbox = (val: string, checked: boolean = false) => {
    setPublishChannel(val, checked);

    if (checked) {
      // When a checkbox is checked, add the channel data
      const channelDataObj: channelDataType = {
        channelType: val,
        price: (productPrice as number) || 0,
        quantity: (productInventory as number) || 0,
        mrp: (discountedPrice as number) || 0,
      };
      setChannelData(channelDataObj);
    } else {
      // When a checkbox is unchecked, clear the channel data
      setChannelData(null, val);

      // Clear fields based on the channel
      if (val === "ONDC") {
        // Always clear price
        setValue("ondcPrice", undefined, { shouldValidate: false });

        // Only clear inventory if not unified
        if (inventoryStrategy !== "UNIFIED") {
          setValue("ondcInventory", undefined, { shouldValidate: false });
        }

        // Clear errors in React Hook Form
        clearErrors(["ondcPrice", "ondcInventory"]);

        // Clear errors in productListError state
        setProductListError({
          ...productListError,
          ondcPrice: undefined,
          ondcInventory: undefined,
        });
      } else if (val === "DEFAULT") {
        // Always clear price
        setValue("defaultPrice", undefined, { shouldValidate: false });

        // Only clear inventory if not unified
        if (inventoryStrategy !== "UNIFIED") {
          setValue("defaultInventory", undefined, { shouldValidate: false });
        }

        // Clear errors in React Hook Form
        clearErrors(["defaultPrice", "defaultInventory"]);

        // Clear errors in productListError state
        setProductListError({
          ...productListError,
          defaultPrice: undefined,
          defaultInventory: undefined,
        });
      } else if (val === "AMAZON") {
        // Always clear price
        setValue("amazonPrice", undefined, { shouldValidate: false });

        // Only clear inventory if not unified
        if (inventoryStrategy !== "UNIFIED") {
          setValue("amazonInventory", undefined, { shouldValidate: false });
        }

        // Clear errors in React Hook Form
        clearErrors(["amazonPrice", "amazonInventory"]);

        // Clear errors in productListError state
        setProductListError({
          ...productListError,
          amazonPrice: undefined,
          amazonInventory: undefined,
        });
      } else if (val === "WOOCOMMERCE") {
        // Always clear price
        setValue("wooCommercePrice", undefined, { shouldValidate: false });

        // Only clear inventory if not unified
        if (inventoryStrategy !== "UNIFIED") {
          setValue("wooCommerceInventory", undefined, {
            shouldValidate: false,
          });

          // Clear errors in productListError state
          setProductListError({
            ...productListError,
            wooCommercePrice: undefined,
            wooCommerceInventory: undefined,
          });
        }
      } else if (val === "SHOPIFY") {
        // Always clear price
        setValue("shopifyPrice", undefined, { shouldValidate: false });

        // Only clear inventory if not unified
        if (inventoryStrategy !== "UNIFIED") {
          setValue("shopifyInventory", undefined, {
            shouldValidate: false,
          });

          // Clear errors in productListError state
          setProductListError({
            ...productListError,
            shopifyPrice: undefined,
            shopifyInventory: undefined,
          });
        }
      }else if (val === "WIX") {
        // Always clear price
        setValue("wixPrice", undefined, { shouldValidate: false });

        // Only clear inventory if not unified
        if (inventoryStrategy !== "UNIFIED") {
          setValue("wixInventory", undefined, {
            shouldValidate: false,
          });

          // Clear errors in productListError state
          setProductListError({
            ...productListError,
            wixPrice: undefined,
            wixInventory: undefined,
          });
        }
      } 
    }
  };
  // Single product data handling
  useEffect(() => {
    if (singleProductData && Object.keys(singleProductData).length > 0) {
      if (Array.isArray(singleProductData.publishChannel)) {
        singleProductData.publishChannel.forEach((channel) => {
          setPublishChannel(channel, true);
        });
      }
    }
  }, [singleProductData.publishChannel, setPublishChannel]);

  // Single product channel data
  useEffect(() => {
    if (singleProductData && Object.keys(singleProductData).length > 0) {
      singleProductData.channelData?.forEach((channel) => {
        setChannelData(channel);
        setVariants();
      });
    }
  }, [singleProductData.channelData, setChannelData, setVariants]);

  // ONDC inventory handling for single product data
  useEffect(() => {
    if (
      singleProductData.ondcInventoryData &&
      Object.keys(singleProductData.ondcInventoryData).length > 0
    ) {
      setValue("ondcInventory", singleProductData.ondcInventoryData.quantity);
    }
  }, [singleProductData.ondcInventoryData, setValue]);

  // ONDC Price handling for single product data
  useEffect(() => {
    if (
      singleProductData.ondcInventoryData &&
      Object.keys(singleProductData.ondcInventoryData).length > 0
    ) {
      setValue("ondcPrice", singleProductData.ondcInventoryData.price);
    }
  }, [singleProductData.ondcInventoryData, setValue]);

  // Default Price handling for single product data
  useEffect(() => {
    if (
      singleProductData.defaultInventoryData &&
      Object.keys(singleProductData.defaultInventoryData).length > 0
    ) {
      setValue("defaultPrice", singleProductData.defaultInventoryData.price);
    }
  }, [singleProductData.defaultInventoryData, setValue]);

  // Default inventory handling for single product data
  useEffect(() => {
    if (
      singleProductData.defaultInventoryData &&
      Object.keys(singleProductData.defaultInventoryData).length > 0
    ) {
      setValue(
        "defaultInventory",
        singleProductData.defaultInventoryData.quantity,
      );
    }
  }, [singleProductData.defaultInventoryData, setValue]);

  // amazon Price handling for single product data

  useEffect(() => {
    if (
      singleProductData.amazonInventoryData &&
      Object.keys(singleProductData.amazonInventoryData).length > 0
    ) {
      setValue("amazonPrice", singleProductData.amazonInventoryData.price);
    }
  }, [singleProductData.amazonInventoryData, setValue]);

  // amazon inventory handling for single product data
  useEffect(() => {
    if (
      singleProductData.amazonInventoryData &&
      Object.keys(singleProductData.amazonInventoryData).length > 0
    ) {
      setValue(
        "amazonInventory",
        singleProductData.amazonInventoryData.quantity,
      );
    }
  }, [singleProductData.amazonInventoryData, setValue]);

  // woocommerce Price handling for single product data

  useEffect(() => {
    if (
      singleProductData.wooCommerceInventoryData &&
      Object.keys(singleProductData.wooCommerceInventoryData).length > 0
    ) {
      setValue(
        "wooCommercePrice",
        singleProductData.wooCommerceInventoryData.price,
      );
    }
  }, [singleProductData.wooCommerceInventoryData, setValue]);

  // woocommerce inventory handling for single product data
  useEffect(() => {
    if (
      singleProductData.wooCommerceInventoryData &&
      Object.keys(singleProductData.wooCommerceInventoryData).length > 0
    ) {
      setValue(
        "wooCommerceInventory",
        singleProductData.wooCommerceInventoryData.quantity,
      );
    }
  }, [singleProductData.wooCommerceInventoryData, setValue]);

  // shopify Price handling for single product data

  useEffect(() => {
    if (
      singleProductData.shopifyInventoryData &&
      Object.keys(singleProductData.shopifyInventoryData).length > 0
    ) {
      setValue("shopifyPrice", singleProductData.shopifyInventoryData.price);
    }
  }, [singleProductData.shopifyInventoryData, setValue]);

  // shopify inventory handling for single product data
  useEffect(() => {
    if (
      singleProductData.shopifyInventoryData &&
      Object.keys(singleProductData.shopifyInventoryData).length > 0
    ) {
      setValue(
        "shopifyInventory",
        singleProductData.shopifyInventoryData.quantity,
      );
    }
  }, [singleProductData.shopifyInventoryData, setValue]);

   // wix Price handling for single product data

  useEffect(() => {
    if (
      singleProductData.wixInventoryData &&
      Object.keys(singleProductData.wixInventoryData).length > 0
    ) {
      setValue("wixPrice", singleProductData.wixInventoryData.price);
    }
  }, [singleProductData.wixInventoryData, setValue]);

  // wix inventory handling for single product data
  useEffect(() => {
    if (
      singleProductData.wixInventoryData &&
      Object.keys(singleProductData.wixInventoryData).length > 0
    ) {
      setValue(
        "wixInventory",
        singleProductData.wixInventoryData.quantity,
      );
    }
  }, [singleProductData.wixInventoryData, setValue]);

  const ondcValue = newChannelData.find((val) => val.channelType.toLowerCase() === "ondc");
  const amazonValue = newChannelData.find((val) => val.channelType.toLowerCase() === "amazon_in");
  const wixValue = newChannelData.find((val) => val.channelType.toLowerCase() === "wix");
  const wooCommerceValue = newChannelData.find((val) => val.channelType.toLowerCase() === "woocommerce");
  const shopifyValue = newChannelData.find((val) => val.channelType.toLowerCase() === "shopify");

  return (
    <div className="flex flex-col gap-5">
      <div className="p-3 md:p-6 flex flex-col gap-5 border border-[Gray-200] bg-white rounded-xl shadow-shadow-xs">
        <div className="">
          <h3 className="-text-Gray-700 md:text-lg text-base font-semibold">
            Publishing Channels
            <span
              className={cn({
                "-text-Error-500": productListError?.channelPublishing,
              })}
            >
              *
            </span>
          </h3>
        </div>
        <div className="flex flex-col md:gap-5 gap-2.5">
          {/* ONDC */}
          {enabledChannels.includes("ONDC") && (
            <div className="grid grid-cols-3 gap-2 justify-center items-center">
              <div className="flex gap-2.5 items-center h-[66px]">
                <InputCheckbox
                  inputId="ondc"
                  value="ONDC"
                  onChange={toggleCheckbox}
                  checked={publishChannel?.includes("ONDC")}
                />
                <LabelComp
                  htmlfor="ondc"
                  name="ONDC"
                  className="-text-Gray-700"
                />
              </div>
              <div className="h-[66px]">
                <InputWithLabel
                  name="ondcInventory"
                  register={register}
                  disabled={
                    inventoryStrategy === "UNIFIED" ||
                    !publishChannel?.includes("ONDC")
                  }
                  value={ondcValue?.quantity}
                  placeholder="0"
                  inputId="ondcInventory"
                  error={errors.ondcInventory}
                  rules={{
                    validate: (value: number) => {
                      if (
                        publishChannel?.includes("ONDC") &&
                        inventoryStrategy !== "UNIFIED"
                      ) {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue <= 0) {
                          return "Quantity must be greater than 0";
                        }
                      }
                      return true;
                    },
                  }}
                />
              </div>
              <div className="h-[66px]">
                <InputComp
                  placeHolder="0"
                  disabled={
                    !publishChannel?.includes("ONDC") || isPriceSameAllChannel
                  }
                  type="number"
                  name="ondcPrice"
                  inputid="ondcPrice"
                  register={register}
                  StartIcon={<RupeeIcon />}
                  error={errors.ondcPrice}
                  className="h-[46px]"
                  value={isPriceSameAllChannel ? productPrice : undefined}
                  rules={{
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0",
                    },
                    validate: (value: number) => {
                      // Check if the channel is selected
                      if (
                        !publishChannel?.includes("ONDC") &&
                        !publishChannel?.includes("DEFAULT")
                      )
                        return true;

                      // Explicit price validation against discounted price
                      if (!value) return "Price is required";

                      // Ensure price is less than discounted price
                      if (Number(value) >= (discountedPrice as number)) {
                        return "Price must be less than compare price";
                      }

                      return true;
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Default */}
          {enabledChannels.includes("DEFAULT") && (
            <div className="grid grid-cols-3 gap-2 justify-center items-center">
              <div className="flex gap-2.5 items-center h-[66px]">
                <InputCheckbox
                  inputId="default"
                  value="DEFAULT"
                  onChange={toggleCheckbox}
                  checked={publishChannel?.includes("DEFAULT")}
                />
                <LabelComp
                  htmlfor="default"
                  name="Default"
                  className="-text-Gray-700"
                />
              </div>
              <div className="h-[66px]">
                <InputWithLabel
                  name="defaultInventory"
                  register={register}
                  disabled={
                    inventoryStrategy === "UNIFIED" ||
                    !publishChannel?.includes("DEFAULT")
                  }
                  placeholder="0"
                  inputId="defaultInventory"
                  error={errors.defaultInventory}
                  rules={{
                    validate: (value: number) => {
                      if (
                        publishChannel?.includes("DEFAULT") &&
                        inventoryStrategy !== "UNIFIED"
                      ) {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue <= 0) {
                          return "Quantity must be greater than 0";
                        }
                      }
                      return true;
                    },
                  }}
                />
              </div>
              <div className="h-[66px]">
                <InputComp
                  disabled={
                    !publishChannel?.includes("DEFAULT") ||
                    isPriceSameAllChannel
                  }
                  placeHolder="0"
                  type="number"
                  name="defaultPrice"
                  inputid="defaultPrice"
                  register={register}
                  StartIcon={<RupeeIcon />}
                  className="h-[46px]"
                  error={errors.defaultPrice}
                  rules={{
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0",
                    },
                    validate: (value: number) => {
                      // Check if the channel is selected
                      if (
                        !publishChannel?.includes("ONDC") &&
                        !publishChannel?.includes("DEFAULT")
                      )
                        return true;

                      // Explicit price validation against discounted price
                      if (!value) return "Price is required";

                      // Ensure price is less than discounted price
                      if (Number(value) >= (discountedPrice as number)) {
                        return "Price must be less than compare price";
                      }

                      return true;
                    },
                  }}
                  value={isPriceSameAllChannel ? productPrice : undefined}
                />
              </div>
            </div>
          )}

          {/* AMAZON */}
          {enabledChannels.includes("AMAZON_IN") && (
            <div className="grid grid-cols-3 gap-2 justify-center items-center">
              <div className="flex gap-2.5 items-center h-[66px]">
                <InputCheckbox
                  inputId="amazon"
                  value="AMAZON"
                  onChange={toggleCheckbox}
                  checked={publishChannel?.includes("AMAZON")}
                />
                <LabelComp
                  htmlfor="amazon"
                  name="AMAZON"
                  className="-text-Gray-700"
                />
              </div>
              <div className="h-[66px]">
                <InputWithLabel
                  name="amazonInventory"
                  register={register}
                  disabled={
                    inventoryStrategy === "UNIFIED" ||
                    !publishChannel?.includes("AMAZON")
                  }
                  value={amazonValue?.quantity}
                  placeholder="0"
                  inputId="amazonInventory"
                  error={errors.amazonInventory}
                  rules={{
                    validate: (value: number) => {
                      if (
                        publishChannel?.includes("AMAZON") &&
                        inventoryStrategy !== "UNIFIED"
                      ) {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue <= 0) {
                          return "Quantity must be greater than 0";
                        }
                      }
                      return true;
                    },
                  }}
                />
              </div>
              <div className="h-[66px]">
                <InputComp
                  placeHolder="0"
                  disabled={
                    !publishChannel?.includes("AMAZON") || isPriceSameAllChannel
                  }
                  type="number"
                  name="amazonPrice"
                  inputid="amazonPrice"
                  register={register}
                  StartIcon={<RupeeIcon/>}
                  error={errors.amazonPrice}
                  className="h-[46px]"
                  value={isPriceSameAllChannel ? productPrice : undefined}
                  rules={{
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0",
                    },
                    validate: (value: number) => {
                      // Check if the channel is selected
                      if (!publishChannel?.includes("AMAZON")) return true;

                      // Explicit price validation against discounted price
                      if (!value) return "Price is required";

                      // Ensure price is less than discounted price
                      if (Number(value) >= (discountedPrice as number)) {
                        return "Price must be less than compare price";
                      }

                      return true;
                    },
                  }}
                />
              </div>
            </div>
          )}
          {/* WOOCOMMERCE */}
          {enabledChannels.includes("WOOCOMMERCE") && (
            <div className="grid grid-cols-3 gap-2 justify-center items-center">
              <div className="flex gap-2.5 items-center h-[66px]">
                <InputCheckbox
                  inputId="woocommerce"
                  value="WOOCOMMERCE"
                  onChange={toggleCheckbox}
                  checked={publishChannel?.includes("WOOCOMMERCE")}
                />
                <LabelComp
                  htmlfor="woocommerce"
                  name="WOO-COMMERCE"
                  className="-text-Gray-700"
                />
              </div>
              <div className="h-[66px]">
                <InputWithLabel
                  name="wooCommerceInventory"
                  register={register}
                  disabled={
                    inventoryStrategy === "UNIFIED" ||
                    !publishChannel?.includes("WOOCOMMERCE")
                  }
                  value={wooCommerceValue?.quantity}
                  placeholder="0"
                  inputId="wooCommerceInventory"
                  error={errors.wooCommerceInventory}
                  rules={{
                    validate: (value: number) => {
                      if (
                        publishChannel?.includes("WOOCOMMERCE") &&
                        inventoryStrategy !== "UNIFIED"
                      ) {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue <= 0) {
                          return "Quantity must be greater than 0";
                        }
                      }
                      return true;
                    },
                  }}
                />
              </div>
              <div className="h-[66px]">
                <InputComp
                  placeHolder="0"
                  disabled={
                    !publishChannel?.includes("WOOCOMMERCE") ||
                    isPriceSameAllChannel
                  }
                  type="number"
                  name="wooCommercePrice"
                  inputid="wooCommercePrice"
                  register={register}
                  StartIcon={<RupeeIcon />}
                  error={errors.wooCommercePrice}
                  className="h-[46px]"
                  value={isPriceSameAllChannel ? productPrice : undefined}
                  rules={{
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0",
                    },
                    validate: (value: number) => {
                      // Check if the channel is selected
                      if (!publishChannel?.includes("WOOCOMMERCE")) return true;

                      // Explicit price validation against discounted price
                      if (!value) return "Price is required";

                      // Ensure price is less than discounted price
                      if (Number(value) >= (discountedPrice as number)) {
                        return "Price must be less than compare price";
                      }

                      return true;
                    },
                  }}
                />
              </div>
            </div>
          )}
          {/* SHOPIFY */}
          {enabledChannels.includes("SHOPIFY") && (
            <div className="grid grid-cols-3 gap-2 justify-center items-center">
              <div className="flex gap-2.5 items-center h-[66px]">
                <InputCheckbox
                  inputId="shopify"
                  value="SHOPIFY"
                  onChange={toggleCheckbox}
                  checked={publishChannel?.includes("SHOPIFY")}
                />
                <LabelComp
                  htmlfor="shopify"
                  name="SHOPIFY"
                  className="-text-Gray-700"
                />
              </div>
              <div className="h-[66px]">
                <InputWithLabel
                  name="shopifyInventory"
                  register={register}
                  disabled={
                    inventoryStrategy === "UNIFIED" ||
                    !publishChannel?.includes("SHOPIFY")
                  }
                  value={shopifyValue?.quantity}
                  placeholder="0"
                  inputId="shopifyInventory"
                  error={errors.shopifyInventory}
                  rules={{
                    validate: (value: number) => {
                      if (
                        publishChannel?.includes("SHOPIFY") &&
                        inventoryStrategy !== "UNIFIED"
                      ) {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue <= 0) {
                          return "Quantity must be greater than 0";
                        }
                      }
                      return true;
                    },
                  }}
                />
              </div>
              <div className="h-[66px]">
                <InputComp
                  placeHolder="0"
                  disabled={
                    !publishChannel?.includes("SHOPIFY") ||
                    isPriceSameAllChannel
                  }
                  type="number"
                  name="shopifyPrice"
                  inputid="shopifyPrice"
                  register={register}
                  StartIcon={<RupeeIcon />}
                  error={errors.shopifyPrice}
                  className="h-[46px]"
                  value={isPriceSameAllChannel ? productPrice : undefined}
                  rules={{
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be greater than 0",
                    },
                    validate: (value: number) => {
                      // Check if the channel is selected
                      if (!publishChannel?.includes("SHOPIFY")) return true;

                      // Explicit price validation against discounted price
                      if (!value) return "Price is required";

                      // Ensure price is less than discounted price
                      if (Number(value) >= (discountedPrice as number)) {
                        return "Price must be less than compare price";
                      }

                      return true;
                    },
                  }}
                />
              </div>
            </div>
          )}
          {/* Wix */}
          {enabledChannels.includes("WIX") && (
          <div className="grid grid-cols-3 gap-2 justify-center items-center">
            <div className="flex gap-2.5 items-center h-[66px]">
              <InputCheckbox
                inputId="wix"
                value="WIX"
                onChange={toggleCheckbox}
                checked={publishChannel?.includes("WIX")}
              />
              <LabelComp htmlfor="wix" name="WIX" className="-text-Gray-700" />
            </div>
            <div className="h-[66px]">
              <InputWithLabel
                name="wixInventory"
                register={register}
                disabled={
                  inventoryStrategy === "UNIFIED" ||
                  !publishChannel?.includes("WIX")
                }
                value={wixValue?.quantity}
                placeholder="0"
                inputId="wixInventory"
                error={errors.wixInventory}
                rules={{
                  validate: (value: number) => {
                    if (
                      publishChannel?.includes("WIX") &&
                      inventoryStrategy !== "UNIFIED"
                    ) {
                      const numValue = Number(value);
                      if (isNaN(numValue) || numValue <= 0) {
                        return "Quantity must be greater than 0";
                      }
                    }
                    return true;
                  },
                }}
              />
            </div>
            <div className="h-[66px]">
              <InputComp
                placeHolder="0"
                disabled={
                  !publishChannel?.includes("WIX") || isPriceSameAllChannel
                }
                type="number"
                name="wixPrice"
                inputid="wixPrice"
                register={register}
                StartIcon={<RupeeIcon />}
                error={errors.wixPrice}
                className="h-[46px]"
                value={isPriceSameAllChannel ? productPrice : undefined}
                rules={{
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price must be greater than 0",
                  },
                  validate: (value: number) => {
                    // Check if the channel is selected
                    if (!publishChannel?.includes("WIX")) return true;

                    // Explicit price validation against discounted price
                    if (!value) return "Price is required";

                    // Ensure price is less than discounted price
                    if (Number(value) >= (discountedPrice as number)) {
                      return "Price must be less than compare price";
                    }

                    return true;
                  },
                }}
              />
            </div>
          </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default ChannelPublishingBasics;
