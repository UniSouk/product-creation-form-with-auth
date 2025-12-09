import React, { useEffect, useRef } from "react";

import {
  AddOptionPayloadType,
  ColorVariationType,
  ItemWeightVariationType,
  SizeValueType,
} from "@/type/variation-type";
import SizePropComp from "./SizePropComp";
import ColorPropComp from "./ColorPropComp";
import WeightPropComp from "./WeightPropComp";
import VariationPropComp from "./VariationPropComp";
import ScentPropComp from "./ScentPropComp";
import FlavorPropComp from "./FlavorPropComp";
import NumberOfItemsPropComp from "./NumberOfItemsPropComp";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useProductStore } from "@/store/ProductStore";
// import useVariationStore from "@/stores/variationStore";
import { getStoreId } from "@/lib/cookies";
import useVariationStore from "@/store/VariationStore";
import { AxiosError } from "axios";
import { errorToast, successToast } from "@/ui/Toast";
const storeId = getStoreId();

interface MainVariationcompType {
  schema: any;
  errors?: any;
}
//  add option in variants

export const addOptionsHandleMutation = (onSuccessRefetchData: () => void) =>
  useMutation({
    mutationFn: async (payload: AddOptionPayloadType) => {
      const { data } = await api.post("/api/option", payload, {
        headers: {
          "x-store-id": storeId,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      onSuccessRefetchData();
      successToast(data.message);
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError && error.response) {
        errorToast(error.response.data.message);
      } else {
        errorToast("Something went wrong");
      }
    },
  });

function MainVariationcomp({ schema, errors = {} }: MainVariationcompType) {
  const { isVariant } = useProductStore();
  const { setVariation } = useVariationStore();

  const optionsRef = useRef<{
    [key: string]: {
      label: SizeValueType | ColorVariationType | ItemWeightVariationType;
      value: SizeValueType | ColorVariationType | ItemWeightVariationType;
    }[];
  }>({});

  useEffect(() => {
    if (!isVariant) {
      setVariation([]);
    }
  }, [isVariant]);

  return (
    <div>
      {schema?.properties && Object.entries(schema.properties).map(([rootKey, rootValue]) => {
        if (rootKey === "variation" && isVariant) {
          return (
            <React.Fragment key={rootKey}>
              <VariationPropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
            </React.Fragment>
          );
        } else if (rootKey === "size") {
          return (
            <React.Fragment key={rootKey}>
              <SizePropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
              {errors && errors[rootKey] && (
                <p className="text-Error-500 text-sm">
                  {errors[rootKey].message}
                </p>
              )}
            </React.Fragment>
          );
        } else if (rootKey === "color") {
          return (
            <React.Fragment key={rootKey}>
              <ColorPropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
              {errors && errors[rootKey] && (
                <p className="text-Error-500 text-sm">
                  {errors[rootKey].message}
                </p>
              )}
            </React.Fragment>
          );
        } else if (rootKey === "itemWeight") {
          return (
            <React.Fragment key={rootKey}>
              <WeightPropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
              {errors && errors[rootKey] && (
                <p className="text-Error-500 text-sm">
                  {errors[rootKey].message}
                </p>
              )}
            </React.Fragment>
          );
        } else if (rootKey === "scent") {
          return (
            <React.Fragment key={rootKey}>
              <ScentPropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
              {errors && errors[rootKey] && (
                <p className="text-Error-500 text-sm">
                  {errors[rootKey].message}
                </p>
              )}
            </React.Fragment>
          );
        } else if (rootKey === "flavor") {
          return (
            <React.Fragment key={rootKey}>
              <FlavorPropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
              {errors && errors[rootKey] && (
                <p className="text-Error-500 text-sm">
                  {errors[rootKey].message}
                </p>
              )}
            </React.Fragment>
          );
        } else if (rootKey === "numberOfItems") {
          return (
            <React.Fragment key={rootKey}>
              <NumberOfItemsPropComp
                schemaValue={rootValue as Record<string, unknown>}
                key={rootKey}
                optionsRef={optionsRef}
                mainKey={rootKey}
              />
              {errors && errors[rootKey] && (
                <p className="text-Error-500 text-sm">
                  {errors[rootKey].message}
                </p>
              )}
            </React.Fragment>
          );
        }
      })}
    </div>
  );
}

export default MainVariationcomp;
