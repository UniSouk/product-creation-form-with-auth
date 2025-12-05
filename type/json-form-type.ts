
export interface SchemaProperty {
  type: "string" | "number" | "integer" | "boolean" | string;
  title?: string;
  description?: string;
  examples?: string[];
  enum?: Array<string | boolean>;
  enumNames?: string[];
  default?: string | number | boolean;
  editable?: boolean;
  hidden?: boolean;
  minItems?: number;
  minUniqueItems?: number;
  maxUniqueItems?: number;
  selectors?: string[];
  items?: {
    type: string;
    required?: string[];
    properties?: Record<string, SchemaProperty>;
    additionalProperties?: boolean;
  };
  parentKey?: string;
  
}

export interface JsonSchema {
  $id?: string;
  $comment?: string;
  $defs?: Record<string, SchemaProperty>;
  type: string;
  properties?: Record<string, SchemaProperty>;
}

export type PrimitiveValue = string | number | boolean;
export type SchemaValue = PrimitiveValue;

export interface JsonFormsProps {
  setIsSave?: React.Dispatch<React.SetStateAction<boolean>>;
  enumSchemaKeyValuePair: EnumSchemaState;
  data: any;
  schema: JsonSchema;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onValidate?: (data: Record<string, SchemaValue>) => void;
  onRequiredValidate?: (data: Record<string, SchemaValue>) => void;
  fieldErrors: Record<string, string>;
  loadFieldError: Record<string, string>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
export type UskData = Record<
  string,
  string | boolean | Record<string, string>[] | Record<string, PrimitiveValue>[]|any
>;

type EnumOption = Record<string, string | number | boolean>;

type EnumSchemaKeyValuePair = { [key: string]: EnumOption };

export type EnumSchemaState = EnumSchemaKeyValuePair;

export interface SchemaEnum {
  enum?: (string | number | boolean)[];
  enumNames?: string[];
  type?: string;
  items?: {
    properties?: Record<string, SchemaEnum>;
    type?: string;
  };
  properties?: Record<string, SchemaEnum>;
}
