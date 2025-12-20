import JsonForms from "./JsonForms";
// import Schema from "../../schemas/SHOES_SCHEMA1.json";
// import OriginalSchema from "../../schemas/SHOES_SCHEMA.json";
import Ajv from "ajv";
import { useEffect, useState } from "react";
import {
  EnumSchemaState,
  SchemaEnum,
  SchemaValue,
  UskData,
} from "@/type/json-form-type";
import { convertDataToAmz } from "@/utils/dataConverter";
import { ONDCJSONSchema, ondcShemaFilter } from "@/utils/OndcSchemaFilter";
import { useProductStore } from "@/store/ProductStore";
import { transformSchema } from "@/utils/convertUskDataToAmzData";
import { Buffer } from "buffer";

interface DynamicFormPropsType {
  Schema: ONDCJSONSchema;
  initialData?: Record<string, any>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab?: string;
}

// =========================================== amazon initial data ================================
// const initialData:UskData = {
//     "item_name/0/value": "myval",
//     "item_name/0/language_tag": "en_IN",
//     "heel/0/height/0/decimal_value": 1,
//     "heel/0/height/0/unit": "centimeters",
//     "heel/0/type/0/value": "Block Heel",
//     "heel/0/type/0/language_tag": "en_IN",
//     "insole/0/material/0/value": "Cotton",
//     "insole/0/material/0/language_tag": "en_IN",
//     "master_pack_dimensions/0/height/value": 1,
//     "master_pack_dimensions/0/height/unit": "angstrom",
//     "master_pack_dimensions/0/length/value": 1,
//     "master_pack_dimensions/0/length/unit": "angstrom",
//     "master_pack_dimensions/0/width/value": 1,
//     "master_pack_dimensions/0/width/unit": "angstrom",
//     "externally_assigned_product_identifier/0/type": "ean",
//     "externally_assigned_product_identifier/0/value": "myval",
//     "supplier_declared_has_product_identifier_exemption/0/value": false,
//     bullet_point: [
//       {
//         value: "bullet1",
//         language_tag: "en_IN",
//       },
//     ],
//   }

// ========================================= ONDC INITIAL DATA =======================================

function DynamicFormsRenderComp({
  Schema,
  initialData,
  setOpen,
  activeTab,
}: DynamicFormPropsType) {
  // Ensure Buffer is available in browser environment
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = Buffer;
  }
  
  const { setAmazonExtraData } = useProductStore();
  const [data, setdata] = useState<UskData>({
    ...initialData,
    // ...ondcExtraData,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loadFieldError, setLoadFieldError] = useState<Record<string, string>>(
    {},
  );
  const [schema, setSchema] = useState<ONDCJSONSchema | null>(null);
  const [enumSchemaKeyValuePair, setEnumSchemaKeyValuePair] =
    useState<EnumSchemaState>({});
  const [amazonSchemaValue, setAmazonSchemaValue] = useState<Record<
    string,
    any
  > | null>(null);
  const [iSSave, setISSave] = useState<boolean>(false);

  useEffect(() => {
    const loadTransformedSchema = async () => {
      try {
        const transformedData = await transformSchema(Schema);
        setSchema(transformedData);
      } catch (error) {
        console.error("Error transforming schema:", error);
      }
    };

    loadTransformedSchema();
  }, []);

  useEffect(() => {
    if (!schema) return;
    Object.entries(schema?.properties).forEach(
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
  }, [schema]);

  useEffect(() => {
    if (initialData && schema) {
      try {
        const convertedValue = convertDataToAmz(initialData, schema);

        setAmazonSchemaValue(convertedValue);
      } catch (error) {
        console.error("Error converting data to AMZ format:", error);
      }
    }
  }, [initialData, schema]);

  const ajv = new Ajv({
    strict: false,
    validateSchema: false,
    allErrors: true,
  });
  const validate = ajv.compile(Schema);

  const requiredValidation = (formData: Record<string, SchemaValue>) => {
    const valid = validate(formData);
    const errorMap: Record<string, string> = {};
    if (!valid) {
      validate.errors?.forEach((error) => {
        if (error.keyword === "required") {
          const fieldKey = error.params.missingProperty;
          errorMap[fieldKey] = error.keyword;
          setLoadFieldError(errorMap);
        }
      });
    }
  };

  useEffect(() => {
    if (activeTab === "AMAZON" && amazonSchemaValue) {
      requiredValidation(amazonSchemaValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, amazonSchemaValue]);

  const handleValidation = (formData: Record<string, SchemaValue>) => {
    const valid = validate(formData);
    if (!valid) {
      const errors = validate.errors || [];
      const errorMap: Record<string, string> = {};

      errors.forEach((error) => {
        let fieldKey = "";

        if (error.instancePath) {
          const valueProperty = error.params?.missingProperty;
          fieldKey =
            error.instancePath.replace(/^\//, "") + "/" + valueProperty;
        }

        if (!fieldKey && error.params?.missingProperty) {
          fieldKey = error.params.missingProperty;
        }

        if (fieldKey) {
          errorMap[fieldKey] = error.message || "Invalid value";
        }
      });

      setFieldErrors(errorMap);
    } else {
      setFieldErrors({});
    }
  };

  useEffect(() => {
    if (Object.keys(data).length > 0 && iSSave) {
      if (activeTab === "AMAZON") {
        setAmazonExtraData({ ...data });
      }
    }
  }, [data, iSSave]);

  useEffect(() => {
    return () => {
      setISSave(false);
    };
  }, []);

  // ondc schema filter
  ondcShemaFilter(Schema);
  useEffect(() => {
    if (activeTab === "ONDC") {
      setSchema(ondcShemaFilter(Schema));
    }
  }, [Schema]);

  return (
    <>
      {schema && (
        <JsonForms
          setIsSave={setISSave}
          schema={schema}
          setData={setdata}
          loadFieldError={loadFieldError}
          data={data}
          onValidate={handleValidation}
          onRequiredValidate={requiredValidation}
          fieldErrors={fieldErrors}
          enumSchemaKeyValuePair={enumSchemaKeyValuePair}
          setOpen={setOpen}
        />
      )}
    </>
  );
}

export default DynamicFormsRenderComp;
