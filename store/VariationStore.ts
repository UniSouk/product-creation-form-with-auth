/* eslint-disable */
// @ts-nocheck
import { create } from "zustand";
import {
  ColorVariationType,
  DataItem,
  FlavorVariationType,
  ItemWeightVariationType,
  NumberOfItemsVariationType,
  ScentVariationType,
  SizeValueType,
  SizeVariationType,
  Variants,
  VariationStoreState,
} from "@/types/variationType";
import { useProductStore } from "./ProductStore";

const useVariationStore = create<VariationStoreState>((set, get) => ({
  variation: [],
  setVariation: (value: Record<string, string>[]) => {

    set((state) => ({
      ...state,
      variation: value.map((item) => item.value),
    }));
},

  // size name

  sizeName: "",
  setSizeName(val) {
    set((state) => ({
      ...state,
      sizeName: val,
    }));
  },

  // size display name

  sizeDisplayName: "",
  setSizeDisplayName(val) {
    set((state) => ({
      ...state,
      sizeDisplayName: val,
    }));
  },

  // size

  size: [] as SizeVariationType[],
  setSizeSchemaValue: (value) => {
    const { variation, sizeName, sizeDisplayName } = get();
    const gender = useProductStore.getState().gender;

    set((state: any) => {
      if (value && Object.keys(value).length === 0) {
        return {
          ...state,
          size: [],
        };
      }
      const newSizeVariation: SizeVariationType = {
        gender: gender as string,
        brand: "default",
        name: sizeName,
        displayName: sizeDisplayName,
      };

      if (!variation.includes("size")) {
        newSizeVariation.value = [value as SizeValueType];
        return {
          ...state,
          size: [newSizeVariation],
        };
      } else {

        if (!Array.isArray(value)) {
          if (value && typeof value === "object") {
            const updatedSize = {
              ...newSizeVariation,
              value: [(value as SizeVariationType).value].flat(),
            };
            return {
              ...state,
              size: [updatedSize],
            };
          } else {
            return {
              ...state,
              size: [
                {
                  ...newSizeVariation,
                  value: [],
                },
              ],
            };
          }
        }

        const updatedSizes = (value as SizeVariationType[]).map((element) => ({
          ...newSizeVariation,
          value: Array.isArray(element.value) ? element.value : [element.value],
        }));

        return {
          ...state,
          size: [...updatedSizes],
        };
      }
    });
  },

  // color

  color: [] as ColorVariationType[],
  setColorVariationValue: (colorValue: ColorVariationType) => {
    const { variation } = get();
    set((state) => {
      // If colorValue is empty (no properties), reset to empty array
      if (colorValue && Object.keys(colorValue).length === 0) {
        return {
          ...state,
          color: [],
        };
      }

      if (!variation.includes("color")) {

        // Check if colorValue has needed properties before creating the object
        const newColorVariants = {
          displayName: colorValue?.displayName,
          hexCode: colorValue?.hexCode,
          value: colorValue?.value,
        };

        return {
          ...state,
          color: [newColorVariants],
        };
      } else {

        // Make sure colorValue is an array before mapping
        if (Array.isArray(colorValue)) {
          const updatedColors = colorValue.map((element) => {
            const newColorVariants: ColorVariationType = {
              displayName: element.value?.displayName,
              hexCode: element.value?.hexCode,
              value: element.value?.value,
            };
            return {
              ...newColorVariants,
            };
          });
          return {
            ...state,
            color: [...updatedColors],
          };
        }

        // Return current state if colorValue is not as expected
        return state;
      }
    });
  },
  // flavor
  flavor: [] as FlavorVariationType[],
  setFlavorVariationValue(flavorValue: FlavorVariationType) {
    const { variation } = get();
    set((state) => {
      if (flavorValue && Object.keys(flavorValue).length === 0) {
        return {
          ...state,
          flavor: [],
        };
      }
      if (!variation.includes("flavor")) {
        const newFlavorVariants = {
          displayName: flavorValue.displayName,
          value: flavorValue.value,
        };
        return {
          ...state,
          flavor: [newFlavorVariants],
        };
      } else {

        const updatedFlavor = flavorValue.map((element) => {
          const newFlavorVariants: FlavorVariationType = {
            displayName: element.value.displayName,
            value: element.value.value,
          };
          return {
            ...newFlavorVariants,
          };
        });
        return {
          ...state,
          flavor: [...updatedFlavor],
        };
      }
    });
  },

  // number of items

  numberOfItems: [] as NumberOfItemsVariationType[],
  setNumberOfItemsVariationValue(
    numberOfItemsValue: NumberOfItemsVariationType,
  ) {
    const { variation } = get();
    set((state) => {
      if (numberOfItemsValue && Object.keys(numberOfItemsValue).length === 0) {
        return {
          ...state,
          numberOfItems: [],
        };
      }
      if (!variation.includes("numberOfItems")) {
        const newNumberOfItemsVariants = {
          displayName: numberOfItemsValue.displayName,
          value: Number(numberOfItemsValue.value),
        };
        return {
          ...state,
          numberOfItems: [newNumberOfItemsVariants],
        };
      } else {
        const updatedNumberOfItems = numberOfItemsValue.map((element) => {
          const newNumberOfItemsVariants: NumberOfItemsVariationType = {
            displayName: element.value.displayName,
            value: Number(element.value.value),
          };
          return {
            ...newNumberOfItemsVariants,
          };
        });
        return {
          ...state,
          numberOfItems: [...updatedNumberOfItems],
        };
      }
    });
  },

  // scents

  scent: [] as ScentVariationType[],
  setScentVariationValue(scentValue: ScentVariationType) {
    const { variation } = get();
    set((state) => {
      if (scentValue && Object.keys(scentValue).length === 0) {
        return {
          ...state,
          scent: [],
        };
      }
      if (!variation.includes("scent")) {
        const newScentVariants = {
          displayName: scentValue.displayName,
          value: scentValue.value,
        };
        return {
          ...state,
          scent: [newScentVariants],
        };
      } else {
        const updatedScent = scentValue.map((element) => {
          const newScentVariants: ScentVariationType = {
            displayName: element.value.displayName,
            value: element.value.value,
          };
          return {
            ...newScentVariants,
          };
        });

        return {
          ...state,
          scent: [...updatedScent],
        };
      }
    });
  },

  // weight

  itemWeight: [] as ItemWeightVariationType[],
  setItemWeightVaritionValue: (itemWeightValue: ItemWeightVariationType) => {
    set((state) => {
      if (itemWeightValue && Object.keys(itemWeightValue).length === 0) {
        return {
          ...state,
          itemWeight: [],
        };
      }
      const { variation } = get();
      if (!variation.includes("weight")) {
        const newWeightVariants = {
          displayName: itemWeightValue.displayName,
          value: itemWeightValue.value,
          unit: itemWeightValue.unit,
        };
        return {
          ...state,
          itemWeight: [newWeightVariants],
        };
      } else {
        const updatedItemWeight = itemWeightValue.map((element) => {
          const newWeightVariants = {
            displayName: element.value.displayName,
            value: element.value.value,
            unit: element.value.unit,
          };
          return {
            ...newWeightVariants,
          };
        });
        return {
          ...state,
          itemWeight: [...updatedItemWeight],
        };
      }
    });
  },

  variants: [] as Variants[],
  setVariants: () => {
    const { size, color, itemWeight, flavor, scent, numberOfItems } = get();
    const channelData = useProductStore.getState().channelData;
    const eanNumber = useProductStore.getState().eanNumberCode;
    const isVariant = useProductStore.getState().isVariant;

    const tranverseChannelData = channelData?.map((item)=>{
      if (item?.channelType === "AMAZON"){
        return{
          ...item,
          channelType:"AMAZON_IN"
        }
      }else{
        return{
          ...item,
          channelType:item?.channelType
        }
      }
    })    

    set((state) => {
      const newVariants: Variants[] = [];

      const sizes = size.length ? size : [undefined];
      const colors = color.length ? color : [undefined];
      const itemWeights = itemWeight.length ? itemWeight : [undefined];
      const flavors = flavor.length ? flavor : [undefined];
      const numberOfItemsList = numberOfItems.length
        ? numberOfItems
        : [undefined];
      const scents = scent.length ? scent : [undefined];

      sizes.forEach((sizeVal) => {
        colors.forEach((colorVal) => {
          itemWeights.forEach((itemWeightVal) => {
            flavors.forEach((flavorVal) => {
              numberOfItemsList.forEach((numberOfItemsVal) => {
                scents.forEach((scentval) => {
                  const variant: Variants = {
                    option: {
                      type: isVariant ? "custom" : "default",
                      data: {
                        size: sizeVal,
                        color: colorVal,
                        itemWeight: itemWeightVal,
                        flavor: flavorVal,
                        numberOfItems: numberOfItemsVal,
                        scent: scentval,
                      },
                    },
                    channelData: tranverseChannelData,
                    variantAssets: [],
                    externalProductId: { type: "EAN", value: eanNumber },
                  };
                  newVariants.push(variant);
                });
              });
            });
          });
        });
      });

      return {
        ...state,
        variants: newVariants,
        // updatedVariants:newVariants
      };
    });
  },

  // variation type list
  variationTypeList: [],
  setVariationTypeList(val) {
    set((state) => ({
      ...state,
      variationTypeList: val,
    }));
  },

  channelPublishData() {
    const {
      //  variationTypeList,
      size,
      color,
      flavor,
      numberOfItems,
      scent,
      itemWeight,
    } = get();
    const { productInventory, productPrice } = useProductStore.getState();
    const productVariantListData: DataItem[] = [];
    let idCounter = 1;
    // TODO: the following code is unused for now
    // let variantList: string[] = [];
    // if (variationTypeList.length > 0) {
    //   variantList = variationTypeList.map((variantType) => {
    //     return variantType.value;
    //   });
    // }
    size.forEach((sizeVal) => {
      let sizeLabel =
        Array.isArray(sizeVal.value) && sizeVal.value[0].displayName;
      color.forEach((colorVal) => {
        productVariantListData.push({
          id: idCounter++,
          size: sizeLabel as string,
          color: colorVal.displayName,
          quantity: productInventory ? parseInt(productInventory as string) : 0,
          ondcPrice: parseFloat((productPrice as string) || "0") || 0,
          defaultPrice: parseFloat((productPrice as string) || "0") || 0,
        });
      });
      flavor.forEach((flavorVal) => {
        productVariantListData.push({
          id: idCounter++,
          size: sizeLabel as string,
          flavor: flavorVal.displayName,
          quantity: productInventory ? parseInt(productInventory as string) : 0,
          ondcPrice: parseFloat((productPrice as string) || "0") || 0,
          defaultPrice: parseFloat((productPrice as string) || "0") || 0,
        });
      });
      numberOfItems.forEach((numberOfItemsVal) => {
        productVariantListData.push({
          id: idCounter++,
          size: sizeLabel as string,
          numberOfItems: numberOfItemsVal.displayName,
          quantity: productInventory ? parseInt(productInventory as string) : 0,
          ondcPrice: parseFloat((productPrice as string) || "0") || 0,
          defaultPrice: parseFloat((productPrice as string) || "0") || 0,
        });
      });
      scent.forEach((scentVal) => {
        productVariantListData.push({
          id: idCounter++,
          size: sizeLabel as string,
          scent: scentVal.displayName,
          quantity: productInventory ? parseInt(productInventory as string) : 0,
          ondcPrice: parseFloat((productPrice as string) || "0") || 0,
          defaultPrice: parseFloat((productPrice as string) || "0") || 0,
        });
      });
      itemWeight.forEach((itemWeightVal) => {
        productVariantListData.push({
          id: idCounter++,
          size: sizeLabel as string,
          itemWeight: itemWeightVal.displayName,
          quantity: productInventory ? parseInt(productInventory as string) : 0,
          ondcPrice: parseFloat((productPrice as string) || "0") || 0,
          defaultPrice: parseFloat((productPrice as string) || "0") || 0,
        });
      });
    });

    return productVariantListData;
  },
  updatedVariants: [],
  setUpdatedVariants(val) {
    set((state) => ({
      ...state,
      updatedVariants: val,
    }));
  },
}));

export default useVariationStore;
