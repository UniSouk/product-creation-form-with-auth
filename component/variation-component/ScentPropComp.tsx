import useVariationStore from "@/store/VariationStore";
import {
  AddOptionPayloadType,
  OnSelect,
  ScentVariationType,
  VariationSchemaType,
} from "@/type/variation-type";
import { useEffect, useState } from "react";
import { VariationRenderForm } from "./VariationRenderForm";
import { useQueryClient } from "@tanstack/react-query";
import { useProductStore } from "@/store/ProductStore";
import { addOptionsHandleMutation } from "./MainVariationcomp";

function ScentPropComp<T extends ScentVariationType>({
  schemaValue,
  mainKey,
  optionsRef,
}: VariationSchemaType<T>) {
  const [scentModal, setScentModal] = useState(false);
  const [isMulti, setIsMulti] = useState<Boolean | undefined>(undefined);
  const { variation, scent, setScentVariationValue, setVariants, variants } =
    useVariationStore();
  const [addScentObj, setAddScentObj] = useState<ScentVariationType>({});
  const { productTypeName } = useProductStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (variation && variation.includes("scent")) {
      setIsMulti(true);
    } else if (scent.length > 1) {
      setScentVariationValue(scent[0]);
      setIsMulti(false);
    } else {
      setIsMulti(false);
    }
  }, [variation, variants]);

  const addScent = (val: Record<string, string>) => {
    setAddScentObj((prev) => {
      const updated = { ...prev, ...val };
      return updated;
    });
  };

  // ADD OPTION IN VARIANTS

  const onSuccessRefetchData = () => {
    queryClient.invalidateQueries({ queryKey: ["variants"] });
    setScentModal(false);
  };
  const { mutate } = addOptionsHandleMutation(onSuccessRefetchData);

  const hanldeAddScent = () => {
    const isItemExist = scent.some(
      (item) => item.value === addScentObj.displayName,
    );

    if (isItemExist) {
      return;
    }
    const newScentVariants = {
      displayName: addScentObj.displayName,
      value: addScentObj.displayName,
    };

    const payload: AddOptionPayloadType = {
      subCategory: productTypeName ?? "",
      attributeName: mainKey,
      value: newScentVariants,
    };
    // api call options cretae

    mutate(payload);
    // setScentVariationValue(newFlavorVariants);
    setVariants();
  };

  const handleOnselect: OnSelect<ScentVariationType> = (value) => {
    setScentVariationValue(value);
    setVariants();
  };

  return (
    <div>
      {Object.entries(schemaValue).map(([rootKey, rootValue]) => {
        return (
          <VariationRenderForm
            AddOption={hanldeAddScent}
            OnChange={addScent}
            value={rootValue}
            rootKey={rootKey}
            isMulti={isMulti as undefined}
            key={rootKey}
            title={schemaValue.title}
            optionsRef={optionsRef}
            mainKey={mainKey}
            modalOpen={scentModal}
            setModalOpen={setScentModal}
            OnSelect={handleOnselect}
            count={scent.length}
          />
        );
      })}
    </div>
  );
}

export default ScentPropComp;
