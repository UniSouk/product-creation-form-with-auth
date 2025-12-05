// import { InitialDataType } from "@/components/jsonformui/DynamicFormsRenderComp";
import {
  FormattedOption,
  VariationOption,
} from "@/utils/singleProductDataConverter";
import { channelDataType } from "./product-type";

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
  enumSchemaKeyValuePair: EnumSchemaState;
  data: any;
  schema: JsonSchema;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onValidate: (data: Record<string, SchemaValue>) => void;
  onRequiredValidate: (data: Record<string, SchemaValue>) => void;
  fieldErrors: Record<string, string>;
  loadFieldError: Record<string, string>;
}
export type UskData = Record<
  string,
  string | boolean | Record<string, string>[] | Record<string, PrimitiveValue>[]
>;

type EnumOption = Record<string, string | number | boolean>;

type EnumSchemaKeyValuePair = { [key: string]: EnumOption };

export type EnumSchemaState = EnumSchemaKeyValuePair;

// variation types

export type OnSelect<T> = (value: T) => void;

export interface VariationSchemaType<T = string | boolean | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemaValue: Record<string, any>;
  optionsRef: OptionsRefType<T>;
  mainKey: string;
  modalOpen?: boolean;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export type OptionsRefType<T> = React.MutableRefObject<{
  [key: string]: { label: T; value: T }[];
}>;
export interface VariationFormType<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  rootKey?: string;
  OnChange?: (val: Record<string, string>) => void;
  title: string | undefined;
  optionsRef?: OptionsRefType<T>;
  mainKey?: string;
  noOption?: boolean | undefined;
  modalOpen?: boolean;
  setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  OnSelect?: OnSelect<T>;
  isMulti?: boolean;
  AddOption?: () => void;
  count?: number;
  defaultValue?: null | FormattedOption[];
}

// stores types

export interface SizeValueType {
  id?: string;
  displayName?: string;
  numericCM?: string;
  numericEU?: string;
  numericUK?: string;
  numericUS?: string;
  width?: string;
}

export interface SizeVariationType {
  id?: string;
  name?: string;
  displayName?: string;
  gender?: string;
  brand?: string;
  type?: string;
  value?: SizeValueType[];
}

export interface ColorVariationType {
  displayName?: string;
  value?: string;
  hexCode?: string;
}

export interface FlavorVariationType {
  displayName?: string;
  value?: string;
}

export interface SizeCreateType {
  displayName?: string;
  value?: string;
}

export interface NumberOfItemsVariationType {
  displayName?: string;
  value?: string | number;
}
export interface ScentVariationType {
  displayName?: string;
  value?: string;
}

export interface ItemWeightVariationType {
  displayName?: string;
  value?: string;
  unit?: string;
}

export type VariationTypeListType = {
  label: string;
  value: string;
};

export interface VariationStoreState {
  variation: string[];
  setVariation: (value: VariationOption[]) => void;
  size: SizeVariationType[];
  setSizeSchemaValue: (val: SizeVariationType[] | SizeCreateType) => void;
  flavor: FlavorVariationType[];
  setFlavorVariationValue: (value: FlavorVariationType) => void;
  scent: FlavorVariationType[];
  setScentVariationValue: (value: FlavorVariationType) => void;
  numberOfItems: NumberOfItemsVariationType[];
  setNumberOfItemsVariationValue: (value: NumberOfItemsVariationType) => void;
  color: ColorVariationType[];
  setColorVariationValue: (value: ColorVariationType) => void;
  itemWeight: ItemWeightVariationType[];
  setItemWeightVaritionValue: (value: ItemWeightVariationType) => void;
  variants: Variants[];
  setVariants: () => void;
  sizeName: string;
  setSizeName: (val: string) => void;
  sizeDisplayName: string;
  setSizeDisplayName: (val: string) => void;
  variationTypeList: VariationTypeListType[];
  setVariationTypeList: (val: VariationTypeListType[]) => void;
  channelPublishData: () => DataItem[];
  updatedVariants: Variants[];
  setUpdatedVariants: (val: Variants[]) => void;
}

export interface VariantsDataType {
  color?: ColorVariationType;
  size?: SizeVariationType;
  itemWeight?: ItemWeightVariationType;
  flavor?: FlavorVariationType;
  numberOfItems?: NumberOfItemsVariationType;
  scent?: ScentVariationType;
}
export interface VariantsOptionType {
  type?: string;
  data?: VariantsDataType;
  id?: string;
}
export type Variants = {
  variantId?: string;
  id?: string;
  option: VariantsOptionType;
  channelData: channelDataType[] | null;
  variantAssets?: { assetId: string }[];
  externalProductId?: { type: string; value: string };
  sku?: string;
  extraData?: any;
  channels?: string[];
  assets?: VariantAsset[];
};

export type AddOptionPayloadType = {
  subCategory?: string;
  attributeName?: string;
  value?: {
    displayName?: string;
    value?: string | number;
    hexCode?: string;
  };
};

export interface DataItem {
  id: number;
  size: string;
  color?: string;
  flavor?: string;
  scent?: string;
  numberOfItems?: string;
  itemWeight?: string;
  sku?: string;
  quantity?: number;
  ondcPrice?: number;
  amazonPrice?: number;
  defaultPrice?: number;
  wooCommercePrice?: number;
  shopifyPrice?: number;
  wixPrice?: number;
  variant?: string;
  variantIndex?: number;
  assetIds?: string[];
}

export type VariantAsset = {
  id: string;
  assetUrl: string;
  metadata?: {
    mimeType?: string;
    [key: string]: any;
  };
  [key: string]: any; // For any other properties
};
