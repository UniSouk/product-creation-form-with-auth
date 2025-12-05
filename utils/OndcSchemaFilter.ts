interface SchemaProperty {
  type: string;
  description?: string;
  editable?: boolean;
  examples?: string[];
  hidden?: boolean;
  parentKey?: string;
  parentTitle?: string;
  enum?: string[];
  enumNames?: string[];
  required?: boolean;
  title?: string;
}

export interface ONDCJSONSchema {
  type: string;
  properties: Record<string, SchemaProperty>;
}

const availableFields: string[] = [
  "productCode",
  "productName",
  "description",
  "longDescription",
  "countryOfOrigin",
  "maxAllowedQty",
  "length",
  "breadth",
  "height",
  "weight",
  "mrp",
  "purchasePrice",
  "quantity",
  "images",
  "backImage",
  "gender",
  "colour",
  "size",
  "brand",
  "colourName",
  "barcode",
  "sizeChart",
  "manufacturedDate",
  "manufacturerName",
  "manufacturerOrPackerName",
  "manufacturerOrPackerAddress",
  "monthOfManufactureOrPacking",
  "monthYearOfManufacturePackingImport",
  "attributes/colour",
  "attributes/size",
];
const defaultFields: string[] = [
  "returnWindow",
  "timeToShip",
  "isCancellable",
  "isReturnable",
  "availableOnCod",
];

export const ondcShemaFilter = (schema: ONDCJSONSchema): ONDCJSONSchema => {
  const newSchema: ONDCJSONSchema = {
    type: "object",
    properties: {},
  };

  const unavailableProperties: Record<string, SchemaProperty> = {};

  Object.keys(schema.properties).forEach((schemaKey) => {
    if (
      !availableFields.includes(schemaKey) &&
      !defaultFields.includes(schemaKey)
    ) {
      unavailableProperties[schemaKey] = schema.properties[schemaKey];
    }
  });

  newSchema.properties = unavailableProperties;
  return newSchema;
};
