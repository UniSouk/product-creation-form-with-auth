interface SchemaProperty {
  title?: string;
  description?: string;
  type: string;
  [key: string]: any; 
}

interface SchemaProperties {
  [key: string]: SchemaProperty;
}

interface Schema {
  $id?: string;
  $comment?: string;
  type: string;
  required?: string[];
  properties: SchemaProperties;
  allOf?: any[];
  additionalProperties?: boolean;
  [key: string]: any; 
}

export const addVariantSchema = (
  schema: Schema,
  attributes: string[],
): Schema => {
  const updatedSchema: Schema = JSON.parse(JSON.stringify(schema));

  const allPropertyKeys: string[] = Object.keys(updatedSchema.properties || {});

  allPropertyKeys.forEach((key: string) => {
    
    if (!attributes.includes(key)) {
      delete updatedSchema.properties[key];

      if (updatedSchema.required && updatedSchema.required.includes(key)) {
        updatedSchema.required = updatedSchema.required.filter(
          (req: string) => req !== key,
        );
      }
    }
  });

  return updatedSchema;
};
