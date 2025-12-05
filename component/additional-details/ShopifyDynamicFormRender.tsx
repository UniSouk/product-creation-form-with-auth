import JsonForms from "./JsonForms";
import { useEffect, useState } from "react";
import {
  EnumSchemaState,
  SchemaEnum,
  // SchemaValue,
  UskData,
} from "@/type/json-form-type";
import { useProductStore } from "@/store/ProductStore";
import { ShopifyJSONSchema } from "@/utils/ShopifySchemaType";


interface DynamicFormPropsType {
  Schema: ShopifyJSONSchema;
  initialData?:Record<string,any>
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ShopifyDynamicFormRender({ Schema ,initialData,setOpen}: DynamicFormPropsType) {
  const { shopifyExtraData, setShopifyExtraData } = useProductStore();
  const [data, setdata] = useState<UskData>({ ...initialData,...shopifyExtraData });
  const [fieldErrors, ] = useState<Record<string, string>>({});
  // const [loadFieldError, setLoadFieldError] = useState<Record<string, string>>(
  //   {},
  // );
  const [schema, setSchema] = useState<ShopifyJSONSchema | null>(null);
  const [enumSchemaKeyValuePair, setEnumSchemaKeyValuePair] =
    useState<EnumSchemaState>({});

  useEffect(() => {
    Object.entries(Schema.properties).forEach(
      ([rootKey, rootValue]: [string, SchemaEnum]) => {
        if (
          typeof rootValue === "object" &&
          rootValue !== null &&
          "enum" in rootValue &&
          Array.isArray(rootValue.enum)
        ) {
          const enumOption = Object.fromEntries(
            (rootValue.enum as (string | number | boolean)[]).map(
              (enumValue, idx) => [enumValue, rootValue.enumNames?.[idx]],
            ),
          );

          setEnumSchemaKeyValuePair((prevState) => ({
            ...prevState,
            [rootKey]: enumOption,
          }));
        } else if (
          typeof rootValue === "object" &&
          rootValue !== null &&
          "items" in rootValue &&
          rootValue.items &&
          "properties" in rootValue.items &&
          typeof rootValue.items.properties === "object"
        ) {
          Object.entries(rootValue.items.properties || {}).forEach(
            ([propKey, propValue]: [string, SchemaEnum]) => {
              if (
                propKey !== "language_tag" &&
                propKey !== "marketPlace_id" &&
                typeof propValue === "object" &&
                propValue !== null &&
                "enum" in propValue &&
                Array.isArray(propValue.enum)
              ) {
                const enumOption = Object.fromEntries(
                  (propValue.enum as (string | number | boolean)[]).map(
                    (enumValue, id) => [enumValue, propValue.enumNames?.[id]],
                  ),
                );

                setEnumSchemaKeyValuePair((prevState) => ({
                  ...prevState,
                  [rootKey]: enumOption,
                }));
              }
            },
          );
        }
      },
    );
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setShopifyExtraData({ ...data });
    }
  }, [data]);  

  // ondc schema filter
  useEffect(() => {
    setSchema(Schema);
  }, [Schema]);


  

  return (
    <>
      {schema && (
        <JsonForms
          schema={schema}
          setData={setdata}
          loadFieldError={{}}
          data={data}
          // onValidate={handleValidation}
          // onRequiredValidate={requiredValidation}
          fieldErrors={fieldErrors}
          enumSchemaKeyValuePair={enumSchemaKeyValuePair}
          setOpen={setOpen}
        />
      )}
    </>
  );
}

export default ShopifyDynamicFormRender;