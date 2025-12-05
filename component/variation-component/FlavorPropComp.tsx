import {
  AddOptionPayloadType,
  FlavorVariationType,
  OnSelect,
  VariationSchemaType,
} from "@/type/variation-type";
import { VariationRenderForm } from "./VariationRenderForm";
import { useEffect, useState } from "react";
import useVariationStore from "@/store/VariationStore";
import { useProductStore } from "@/store/ProductStore";
import { useQueryClient } from "@tanstack/react-query";
import { addOptionsHandleMutation } from "./MainVariationcomp";

function FlavorPropComp<T extends FlavorVariationType>({
  schemaValue,
  mainKey,
  optionsRef,
}: VariationSchemaType<T>) {
  const [flavorModal, setFlavorModal] = useState(false);
  const [isMulti, setIsMulti] = useState<boolean | undefined>(undefined);
  const { variation, flavor, setFlavorVariationValue, setVariants } =
    useVariationStore();
  const [addFlavorObj, setAddFlavorObj] = useState<FlavorVariationType>({});
  const { productTypeName } = useProductStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (variation && variation.includes("flavor")) {
      setIsMulti(true);
    } else if (flavor.length > 1) {
      setFlavorVariationValue(flavor[0]);
      setIsMulti(false);
    } else {
      setIsMulti(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variation]);

  const addFlavor = (val: Record<string, string>) => {
    setAddFlavorObj((prev) => {
      const updated = { ...prev, ...val };
      return updated;
    });
  };

  // ADD OPTION IN VARIANTS

  const onSuccessRefetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["variants"] });
    setFlavorModal(false);
  };
  const { mutate } = addOptionsHandleMutation(onSuccessRefetchData);

  const hanldeAddFlavor = () => {
    const isItemExist = flavor.some(
      (item) => item.value === addFlavorObj.displayName,
    );

    if (isItemExist) {
      return;
    }
    const newFlavorVariants = {
      displayName: addFlavorObj.displayName,
      value: addFlavorObj.value,
    };

    const payload: AddOptionPayloadType = {
      subCategory: productTypeName ?? "",
      attributeName: mainKey,
      value: newFlavorVariants,
    };

    // api call options cretae

    mutate(payload);
    // setFlavorVariationValue(newFlavorVariants);
    setVariants();
  };

  const handleOnselect: OnSelect<FlavorVariationType> = (value) => {
    // const isItemExist = color.some((item) => item.value === value.displayName);

    // if (isItemExist) {
    //   return;
    // }
    //   const newColorVariants = {
    //     displayName: value.displayName,
    //     hexCode: value.hexCode,
    //     value: value.displayName,
    //   };
    setFlavorVariationValue(value);
    setVariants();
  };
  return (
    <div>
      {Object.entries(schemaValue).map(([rootKey, rootValue]) => {
        return (
          <VariationRenderForm
            AddOption={hanldeAddFlavor}
            OnChange={addFlavor}
            value={rootValue}
            rootKey={rootKey}
            isMulti={isMulti as undefined}
            key={rootKey}
            title={schemaValue.title}
            optionsRef={optionsRef}
            mainKey={mainKey}
            modalOpen={flavorModal}
            setModalOpen={setFlavorModal}
            OnSelect={handleOnselect}
            count={flavor.length}
          />
        );
      })}
    </div>
  );
}

export default FlavorPropComp;
