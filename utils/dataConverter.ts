import { PrimitiveValue, UskData } from "@/type/json-form-type";
import { convertUskDataToAmzData } from "./convertUskDataToAmzData";

export const convertDataToAmz = (
  uskData: UskData | Record<string, PrimitiveValue>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: any,
) => {  
  return convertUskDataToAmzData(uskData, schema);
};







