import JsonForms from "./JsonForms";
// import Schema from "../../schemas/SHOES_SCHEMA1.json";
// import OriginalSchema from "../../schemas/SHOES_SCHEMA.json";
// import Ajv from "ajv";
import { useEffect, useState } from "react";
import {
  EnumSchemaState,
  SchemaEnum,
  // SchemaValue,
  UskData,
} from "@/type/json-form-type";
// import { convertDataToAmz } from "@/utils/dataConverter";
import { ONDCJSONSchema, ondcShemaFilter } from "@/utils/OndcSchemaFilter";
import { useProductStore } from "@/store/ProductStore";


interface DynamicFormPropsType {
  Schema: ONDCJSONSchema;
  initialData?:Record<string,any>
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

// =========================================== amazon initial data ================================
// const initialData:UskData = {
//   "item_name/0/value": "myval",
//   "heel/0/height/0/unit": "centimeters",
//   "heel/0/type/0/value": "Block Heel",
//   "insole/0/material/0/value": "Cotton",
//   "master_pack_dimensions/0/height/unit": "angstrom",
//   "batteries_required/0/value": true,
//   "map_policy/0/value": "policy_10",
//   bullet_point: [
//     {
//       value: "Shoes are made from good materials",
//       language_tag: "en_IN",
//     },
//     {
//       value: "Shoes are made from good materialsssss",
//       language_tag: "en_IN",
//     },
//   ],
//   special_feature: [
//     {
//       value: "Abrasion Resistant",
//       language_tag: "en_IN",
//     },
//     {
//       value: "Antimicrobial",
//       language_tag: "en_IN",
//     },
//   ],
// };

// ========================================= ONDC INITIAL DATA =======================================

const defaultValue: UskData = {
  returnWindow: "P7D",
  timeToShip: "P2D",
  isCancellable: true,
  isReturnable: true,
  availableOnCod: true,
};

function OndcDynamicFormRender({ Schema ,initialData,setOpen}: DynamicFormPropsType) {
  const { ondcExtraData, setOndcExtraData } = useProductStore();
  const [data, setdata] = useState<UskData>({ ...initialData,...ondcExtraData });
  const [fieldErrors, ] = useState<Record<string, string>>({});
  // const [loadFieldError, setLoadFieldError] = useState<Record<string, string>>(
  //   {},
  // );
  const [schema, setSchema] = useState<ONDCJSONSchema | null>(null);
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

  // const ajv = new Ajv({
  //   strict: false,
  //   validateSchema: false,
  //   allErrors: true,
  // });
  // const validate = ajv.compile(OriginalSchema);

  // const requiredValidation = (formData: Record<string, SchemaValue>) => {
  //   const valid = validate(formData);
  //   const errorMap: Record<string, string> = {};
  //   if (!valid) {
  //     validate.errors?.forEach((error) => {
  //       if (error.keyword === "required") {
  //         const fieldKey = error.params.missingProperty;
  //         errorMap[fieldKey] = error.keyword;
  //         setLoadFieldError(errorMap);
  //       }
  //     });
  //   }
  // };


  // useEffect(() => {
  //   requiredValidation(amazonSchemaValue);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handleValidation = (formData: Record<string, SchemaValue>) => {
  //   const valid = validate(formData);
  //   if (!valid) {
  //     const errors = validate.errors || [];
  //     const errorMap: Record<string, string> = {};

  //     errors.forEach((error) => {
  //       let fieldKey = "";

  //       if (error.instancePath) {
  //         const valueProperty = error.params?.missingProperty;
  //         fieldKey =
  //           error.instancePath.replace(/^\//, "") + "/" + valueProperty;
  //       }

  //       if (!fieldKey && error.params?.missingProperty) {
  //         fieldKey = error.params.missingProperty;
  //       }

  //       if (fieldKey) {
  //         errorMap[fieldKey] = error.message || "Invalid value";
  //       }
  //     });

  //     setFieldErrors(errorMap);
  //   } else {
  //     setFieldErrors({});
  //   }
  // };

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setOndcExtraData({ ...data, ...defaultValue });
    }
  }, [data]);

  // ondc schema filter
  useEffect(() => {
    setSchema(ondcShemaFilter(Schema));
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

export default OndcDynamicFormRender;