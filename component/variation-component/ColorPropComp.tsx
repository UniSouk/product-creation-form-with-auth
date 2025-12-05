import { useEffect, useState } from "react";
import {
  ColorVariationType,
  ItemWeightVariationType,
  OnSelect,
  SizeValueType,
  VariationSchemaType,
} from "@/type/variation-type";
import { VariationRenderForm } from "./VariationRenderForm";
import useVariationStore from "@/store/VariationStore";
import { addOptionsHandleMutation } from "./MainVariationcomp";
import { useQueryClient } from "@tanstack/react-query";
import { useProductStore } from "@/store/ProductStore";
import { FormattedOption } from "@/utils/singleProductDataConverter";

function ColorPropComp<
  T extends SizeValueType | ColorVariationType | ItemWeightVariationType,
>({ schemaValue, mainKey, optionsRef }: VariationSchemaType<T>) {
  const [colorModal, setColorModal] = useState(false);
  const [isMulti, setIsMulti] = useState<Boolean | undefined>(undefined);
  const [addColorObj, setAddColorObj] = useState<ColorVariationType>({});
  const { variation, color, setColorVariationValue, setVariants } =
    useVariationStore();
  const [defaultData] = useState<undefined | FormattedOption[]>(
    undefined,
  );

  const queryClient = useQueryClient();
  const { productTypeName } = useProductStore();

  useEffect(() => {
    if (variation && variation.includes("color")) {
      setIsMulti(true);
    } else if (color.length > 1) {
      
      setColorVariationValue(color[0]);
      setIsMulti(false);
    } else {
      setIsMulti(false);
    }
  }, [variation]);

  const addColor = (val: Record<string, string>) => {
    setAddColorObj((prev) => {
      const updated = { ...prev, ...val };
      return updated;
    });
  };


  // ADD OPTION IN VARIANTS

  const onSuccessRefetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["variants"] });
    setColorModal(false);
  };
  const { mutate } = addOptionsHandleMutation(onSuccessRefetchData);
  const hanldeAddColor = () => {
    const isItemExist = color.some(
      (item) => item.value === addColorObj.displayName,
    );

    if (isItemExist) {
      return;
    }
    const newColorVariants = {
      displayName: addColorObj.displayName,
      hexCode: addColorObj.hexCode,
      value: addColorObj.value,
    };
    const payload = {
      subCategory: productTypeName ?? "",
      attributeName: mainKey,
      value: newColorVariants,
    };
    mutate(payload);

    // setColorVariationValue(newColorVariants);
    setVariants();
  };

  const handleOnselect: OnSelect<ColorVariationType> = (value) => {
    setColorVariationValue(value);
    setVariants();
  };

  // ========================= edit single product ======================================
  // useEffect(() => {
  //   const ColorVariant = singleProductData.colorVariant;

  //   if (ColorVariant) {
  //     setDefaultData(ColorVariant);

  //     if (ColorVariant?.length > 1) {
  //       setIsMulti(true);
  //     }
  //   }
  // }, [singleProductData.colorVariant, isMulti]);

  // useEffect(() => {
  //   if (singleProductData.colorVariant) {
      
  //     if (singleProductData.colorVariant?.length === 1) {
  //       setColorVariationValue(
  //         singleProductData.colorVariant[0].value as ColorVariationType,
  //       );
  //       setVariants();
  //     } else {
  //       setColorVariationValue(
  //         singleProductData.colorVariant as unknown as ColorVariationType,
  //       );
  //       setVariants();
  //     }
  //   }
  // }, [singleProductData.variation]);

  return (
    <div>
      {Object.entries(schemaValue).map(([rootKey, rootValue]) => {
        return (
          <VariationRenderForm
            defaultValue={defaultData && defaultData}
            AddOption={hanldeAddColor}
            OnChange={addColor}
            value={rootValue}
            rootKey={rootKey}
            isMulti={isMulti as undefined}
            key={rootKey}
            title={schemaValue.title}
            optionsRef={optionsRef}
            mainKey={mainKey}
            modalOpen={colorModal}
            setModalOpen={setColorModal}
            OnSelect={handleOnselect}
            count={color.length}
          />
        );
      })}
    </div>
  );
}

export default ColorPropComp;
