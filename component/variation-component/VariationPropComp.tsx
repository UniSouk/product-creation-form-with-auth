import useVariationStore from "@/store/VariationStore";
import {
  ColorVariationType,
  ItemWeightVariationType,
  OnSelect,
  SizeValueType,
  VariationSchemaType,
} from "@/type/variation-type";
import { VariationRenderForm } from "./VariationRenderForm";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/ProductStore";
import { VariationOption } from "@/utils/singleProductDataConverter";

function VariationPropComp<
  T extends SizeValueType | ColorVariationType | ItemWeightVariationType,
>({ schemaValue, optionsRef, mainKey }: VariationSchemaType<T>) {
  const { setVariation, variation, setVariationTypeList } = useVariationStore();
  const [defaultData, setDefaultData] = useState<undefined | VariationOption[]>(
      undefined,
    );

  const { isVariant,singleProductData } = useProductStore();

  useEffect(() => {
    if (optionsRef.current.Variation) {
      setVariationTypeList(
        optionsRef.current.Variation.map((item) => ({
          label: String(item.label),
          value: String(item.value),
        })),
      );
    }
  }, [isVariant]);


  

  const handleOnselect: OnSelect<
    string | SizeValueType | ColorVariationType
  > = (value) => {
    
    setVariation(value as VariationOption[]);
  };
 // ========================= edit single product =====================================
  useEffect(() => {
    if(singleProductData.variation){
      
      setVariation(singleProductData.variation as VariationOption[])
      setDefaultData(singleProductData.variation)
    }
  }, [singleProductData.variation])
  


  return (
    <div>
      {Object.entries(schemaValue).map(([rootKey, rootValue]) => {
        return (
          <VariationRenderForm
            defaultValue={defaultData}
            value={rootValue}
            key={rootKey}
            isMulti={true}
            rootKey={rootKey}
            title={schemaValue.title}
            optionsRef={optionsRef}
            mainKey={mainKey}
            OnSelect={handleOnselect}
            count={variation && variation.length}
          />
        );
      })}
    </div>
  );
}

export default VariationPropComp;
