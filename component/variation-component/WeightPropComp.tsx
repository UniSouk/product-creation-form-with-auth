import useVariationStore from "@/store/VariationStore";
import {
  AddOptionPayloadType,
  ColorVariationType,
  ItemWeightVariationType,
  OnSelect,
  SizeValueType,
  VariationSchemaType,
} from "@/type/variation-type";
import { useEffect, useState } from "react";
import { VariationRenderForm } from "./VariationRenderForm";
import { useProductStore } from "@/store/ProductStore";
import { useQueryClient } from "@tanstack/react-query";
import { addOptionsHandleMutation } from "./MainVariationcomp";

function WeightPropComp<
  T extends SizeValueType | ColorVariationType | ItemWeightVariationType,
>({ schemaValue, optionsRef, mainKey }: VariationSchemaType<T>) {
  const [isMulti, setIsMulti] = useState<Boolean | undefined>(undefined);
  const [addWeightObj, setAddWeightObj] = useState<ItemWeightVariationType>({});
  const [weightModal, setWeightModal] = useState(false);
  const {
    variation,
    itemWeight,
    setItemWeightVaritionValue,
    setVariants,
    // variants,
  } = useVariationStore();
  const { productTypeName } = useProductStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (variation && variation.includes("itemWeight")) {
      setIsMulti(true);
    } else if (itemWeight.length > 1) {
      setItemWeightVaritionValue(itemWeight[0]);
      setIsMulti(false);
    } else {
      setIsMulti(false);
    }
  }, [variation]);

  const addWeight = (val: Record<string, string>) => {
    setAddWeightObj((prev) => {
      const updated = { ...prev, ...val };
      return updated;
    });
  };

  // ADD OPTION IN VARIANTS

  const onSuccessRefetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["variants"] });
    setWeightModal(false);
  };
  const { mutate } = addOptionsHandleMutation(onSuccessRefetchData);

  const handleAddWeight = () => {
    const isItemExist = itemWeight.some(
      (item) => item.displayName === addWeightObj.displayName,
    );
    if (isItemExist) {
      return;
    }

    const newWeightVariants = {
      displayName: addWeightObj.displayName,
      value: addWeightObj.value,
      unit: addWeightObj.unit,
    };

    const payload: AddOptionPayloadType = {
      subCategory: productTypeName ?? "",
      attributeName: mainKey,
      value: newWeightVariants,
    };

    // api call options cretae

    mutate(payload);
    // setItemWeightVaritionValue(newWeightVariants);
    setVariants();
  };

  const handleOnselect: OnSelect<ItemWeightVariationType> = (value) => {
    setItemWeightVaritionValue(value);
    setVariants();
  };
  return (
    <div>
      {Object.entries(schemaValue).map(([rootKey, rootValue]) => {
        return (
          <VariationRenderForm
            OnChange={addWeight}
            AddOption={handleAddWeight}
            value={rootValue}
            key={rootKey}
            rootKey={rootKey}
            isMulti={isMulti as undefined}
            title={schemaValue.title}
            optionsRef={optionsRef}
            mainKey={mainKey}
            modalOpen={weightModal}
            setModalOpen={setWeightModal}
            OnSelect={handleOnselect}
            count={itemWeight.length}
          />
        );
      })}
    </div>
  );
}

export default WeightPropComp;
