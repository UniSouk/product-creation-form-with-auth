import useVariationStore from "@/store/VariationStore";
import {
  AddOptionPayloadType,
  ColorVariationType,
  ItemWeightVariationType,
  OnSelect,
  SizeCreateType,
  SizeValueType,
  SizeVariationType,
  VariationSchemaType,
} from "@/type/variation-type";
import { useEffect, useState } from "react";
import { VariationRenderForm } from "./VariationRenderForm";
import { useProductStore } from "@/store/ProductStore";
import { useQueryClient } from "@tanstack/react-query";
import { addOptionsHandleMutation } from "./MainVariationcomp";
import { FormattedOption } from "@/utils/singleProductDataConverter";

function SizePropComp<
  T extends SizeValueType | ColorVariationType | ItemWeightVariationType,
>({ schemaValue, mainKey, optionsRef }: VariationSchemaType<T>) {
  const [sizeModal, setSizeModal] = useState(false);
  const [isMulti, setIsMulti] = useState<boolean | undefined>(undefined);
  const [addSizeObj, setAddSizeObj] = useState<SizeCreateType>({});
  const [defaultData, setDefaultData] = useState<undefined | null | FormattedOption[]>(
    undefined,
  );
  const {
    variation,
    size,
    setSizeSchemaValue,
    // variants,
    setVariants,
    setSizeName,
    setSizeDisplayName,
  } = useVariationStore();
  const { productTypeName } = useProductStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if(size.length === 0){
      setDefaultData(null)
    }
    
  }, [size])
  

  useEffect(() => {
    if (schemaValue.description) {
      const description = schemaValue.description.split(" ")[0];
      setSizeName(description);
    }
    if (schemaValue.title) {
      setSizeDisplayName(schemaValue.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaValue]);

  useEffect(() => {
    if (variation && variation.includes("size")) {
      setIsMulti(true);
    } else if (!variation.includes("size") && size.length > 1) {
      if (Array.isArray(size[0].value)) {
        setSizeSchemaValue(size[0].value[0] as SizeCreateType);
      }

      setIsMulti(false);
    } else {
      setIsMulti(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variation]);

  const addSize = (val: Record<string, string>) => {
    setAddSizeObj((prev) => {
      const updated = { ...prev, ...val };
      return updated;
    });
  };

  // ADD OPTION IN VARIANTS

  const onSuccessRefetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["variants"] });
    setSizeModal(false);
  };
  const { mutate } = addOptionsHandleMutation(onSuccessRefetchData);

  const hanldeAddSize = () => {
    const isItemExist = size.some(
      (item) => item.value === addSizeObj.displayName,
    );

    if (isItemExist) {
      return;
    }
    const newSizeVariants: SizeCreateType = {
      displayName: addSizeObj.displayName,
      value: addSizeObj.value,
    };

    const payload: AddOptionPayloadType = {
      subCategory: productTypeName ?? "",
      attributeName: mainKey,
      value: newSizeVariants,
    };
    // api call options cretae

    mutate(payload);

    // setSizeSchemaValue(newSizeVariants);
    setVariants();
  };

  const handleOnselect: OnSelect<SizeValueType> = (value) => {
    
    setSizeSchemaValue(value as SizeVariationType[]);
    setVariants();
  };
  // ========================= edit single product ======================================
//   useEffect(() => {
//     const sizeVariant = singleProductData.sizeVariant;

//     if (sizeVariant) {
//       setDefaultData(sizeVariant);
      
//       if (sizeVariant.length > 1) {
//         setIsMulti(true);
//       }
//     }
//   }, [singleProductData.sizeVariant,isMulti]);

// useEffect(() => {
//   if (singleProductData.sizeVariant) {
//     if (singleProductData.sizeVariant.length === 1) {
//       setSizeSchemaValue(singleProductData.sizeVariant[0]?.value as SizeVariationType[]);
//       setVariants()
//     } else {
//       setSizeSchemaValue(singleProductData.sizeVariant as unknown as SizeVariationType[]);
//       setVariants()
//     }
//   }
// }, [singleProductData.variation]);


  return (
    <div>
      {Object.entries(schemaValue).map(([rootKey, rootValue]) => {
        return (
          <VariationRenderForm
            defaultValue={defaultData && defaultData}
            AddOption={hanldeAddSize}
            OnChange={addSize}
            value={rootValue}
            key={rootKey}
            isMulti={isMulti as undefined}
            rootKey={rootKey}
            title={schemaValue.title}
            optionsRef={optionsRef}
            modalOpen={sizeModal}
            setModalOpen={setSizeModal}
            mainKey={mainKey}
            OnSelect={handleOnselect}
            count={size.length}
          />
        );
      })}
    </div>
  );
}

export default SizePropComp;
