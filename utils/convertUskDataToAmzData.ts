/* eslint-disable */
// @ts-nocheck
// const fs = require("fs");

import traverse from "json-schema-traverse";
import { $RefParser } from "@apidevtools/json-schema-ref-parser";

const complexAttributes = [
  "metals",
  "stones",
  "external_recording_mode",
  "internal_recording_mode",
  "sensor_crop_while_recording",
  "continuous_shooting_mode",
  "image_size_supported",
  "rear_camera_lens",
  "front_camera_lens",
  "test_type",
  "drawer_weight_capacity",
  "drawer_interior_dimensions",
  "cabinet_interior_dimensions",
  "active_ingredient_strength",
  "compatible_vesa_mount_specifications",
  "fuel_economy",
  "vehicle_seat_feature_position",
  "vehicle_mirror_feature_position",
  "oem_added_package_options",
  "electric_vehicle_energy_consumption",
  "epa_vehicle_fuel_economy_us",
  "epa_electric_vehicle_driving_range",
];

function isBuffer(obj) {
  return (
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === "function" &&
    obj.constructor.isBuffer(obj)
  );
}

function keyIdentity(key) {
  return key;
}

function flatten(target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || ".";
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function (key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = type === "[object Object]" || type === "[object Array]";

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
    });
  }
  //@ts-ignore
  step(target);

  return output;
}

function unflatten(target, opts) {
  opts = opts || {};

  const delimiter = opts.delimiter || ".";
  const overwrite = opts.overwrite || false;
  const transformKey = opts.transformKey || keyIdentity;
  const result = {};

  const isbuffer = isBuffer(target);
  if (
    isbuffer ||
    Object.prototype.toString.call(target) !== "[object Object]"
  ) {
    return target;
  }

  // safely ensure that the key is
  // an integer.
  function getkey(key) {
    const parsedKey = Number(key);

    return isNaN(parsedKey) || key.indexOf(".") !== -1 || opts.object
      ? key
      : parsedKey;
  }

  function addKeys(keyPrefix, recipient, target) {
    return Object.keys(target).reduce(function (result, key) {
      result[keyPrefix + delimiter + key] = target[key];

      return result;
    }, recipient);
  }

  function isEmpty(val) {
    const type = Object.prototype.toString.call(val);
    const isArray = type === "[object Array]";
    const isObject = type === "[object Object]";

    if (!val) {
      return true;
    } else if (isArray) {
      return !val.length;
    } else if (isObject) {
      return !Object.keys(val).length;
    }
  }

  target = Object.keys(target).reduce(function (result, key) {
    const type = Object.prototype.toString.call(target[key]);
    const isObject = type === "[object Object]" || type === "[object Array]";
    if (!isObject || isEmpty(target[key])) {
      result[key] = target[key];
      return result;
    } else {
      return addKeys(key, result, flatten(target[key], opts));
    }
  }, {});

  Object.keys(target).forEach(function (key) {
    const split = key.split(delimiter).map(transformKey);
    let key1 = getkey(split.shift());
    let key2 = getkey(split[0]);
    let recipient = result;

    while (key2 !== undefined) {
      if (key1 === "__proto__") {
        return;
      }

      const type = Object.prototype.toString.call(recipient[key1]);
      const isobject = type === "[object Object]" || type === "[object Array]";

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== "undefined") {
        return;
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = typeof key2 === "number" && !opts.object ? [] : {};
      }

      recipient = recipient[key1];
      if (split.length > 0) {
        key1 = getkey(split.shift());
        key2 = getkey(split[0]);
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts);
  });

  return result;
}

export const transformSchema = async (schema) => {
  const originalSchema = JSON.parse(JSON.stringify(schema));
  const transformedSchema = {
    $id: schema.$id,
    $comment: schema.$comment,
    $defs: {
      language_tag: {
        default: "en_IN",
        editable: false,
        hidden: true,
        examples: ["English (India)"],
        type: "string",
      },
    },
    type: "object",
    properties: {},
  };

  const filteredSchema = {
    properties: {},
  };

  Object.keys(schema.properties).forEach((key) => {
    const property = schema.properties[key];
    if (property.maxUniqueItems > 1 && !complexAttributes.includes(key)) {
      // delete marketplace_id
      if (property.items?.properties.marketplace_id) {
        delete property.items.properties.marketplace_id;
      }
      Object.keys(property.items.properties).forEach((field) => {
        if (property.items.properties[field].anyOf) {
          const enumObj = property.items.properties[field].anyOf[1];
          property.items.properties[field] = {
            ...property.items.properties[field],
            ...enumObj,
          };
          delete property.items.properties[field].anyOf;
        }
      });
      filteredSchema.properties[key] = property;
      delete schema.properties[key];
    }
  });

  traverse(
    { properties: schema.properties },
    {
      cb: {
        post: (data, jsonPtr) => {
          if (data.type) {
            if (
              data.type === "string" &&
              !jsonPtr.includes("anyOf") &&
              !jsonPtr.includes("oneOf") &&
              !jsonPtr.includes("allOf")
            ) {
              const parentKey = jsonPtr.split("/")[2];
              const parentProperty = schema.properties[parentKey];
              const key = jsonPtr
                .split("/")
                .slice(2)
                .join("/")
                .replaceAll("items/properties", 0)
                .replaceAll("/properties", "");
              if (
                data.anyOf &&
                Array.isArray(data.anyOf) &&
                data.anyOf.length > 1
              ) {
                transformedSchema.properties[key] = {
                  type: "string",
                  title: data.title,
                  description: data.description,
                  enum: data.anyOf[1].enum,
                  enumNames: data.anyOf[1].enumNames,
                  editable: data.editable,
                  hidden: data.hidden,
                  examples: data.examples,
                  parentKey: parentKey,
                  parentTitle: parentProperty.title,
                  parentDescription: parentProperty.description,
                };
              } else {
                transformedSchema.properties[key] = {
                  ...data,
                  parentKey: parentKey,
                  parentTitle: parentProperty.title,
                  parentDescription: parentProperty.description,
                };
              }
            } else if (
              data.type === "number" ||
              data.type === "integer" ||
              data.type === "boolean"
            ) {
              const parentKey = jsonPtr.split("/")[2];
              const parentProperty = schema.properties[parentKey];
              const key = jsonPtr
                .split("/")
                .slice(2)
                .join("/")
                .replaceAll("items/properties", 0)
                .replaceAll("/properties", "");

              transformedSchema.properties[key] = {
                ...data,
                parentKey: parentKey,
                parentTitle: parentProperty.title,
                parentDescription: parentProperty.description,
              };
            }
          } else if (data.$ref && data.$ref.includes("language_tag")) {
            const parentKey = jsonPtr.split("/")[2];
            const parentProperty = schema.properties[parentKey];
            const key = jsonPtr
              .split("/")
              .slice(2)
              .join("/")
              .replaceAll("items/properties", 0)
              .replaceAll("/properties", "");

            transformedSchema.properties[key] = {
              ...data,
              parentKey: parentKey,
              parentTitle: parentProperty.title,
              parentDescription: parentProperty.description,
            };
          }
        },
      },
    },
  );

  const result = await $RefParser.dereference({
    ...transformedSchema,
    properties: {
      ...filteredSchema.properties,
      ...transformedSchema.properties,
    },
  });

  delete result.$defs;

  const orderedSchema = orderSchema(originalSchema, {
    properties: result.properties,
  });

  return {
    ...transformedSchema,
    properties: {
      ...orderedSchema,
    },
  };
};

// const schemaJson = JSON.parse(
//   fs.readFileSync("./schema/SHOES_SCHEMA.json", "utf8")
// );

// transformSchema(schemaJson).then((transformedSchema) => {
//   fs.writeFileSync(
//     "./transformed/SHOES_SCHEMA.json",
//     JSON.stringify(transformedSchema, null, 2)
//   );
// });

export const convertUskDataToAmzData = (uskData, uskSchema) => {
  const allKeys = Object.keys(uskSchema?.properties);

  const flattenedKeys = new Set(
    allKeys.filter((key) => {
      return uskSchema.properties[key].type !== "array";
    }),
  );

  const unflattenedKeys = new Set(
    allKeys.filter((key) => {
      return uskSchema.properties[key].type === "array";
    }),
  );

  const flattenedAttr = tranformObject(
    Object.keys(uskData).reduce((acc, key) => {
      if (flattenedKeys.has(key)) {
        acc[key] = uskData[key];
      }
      return acc;
    }, {}),
    "language_tag",
  );

  const unflattenedAttr = unflatten(flattenedAttr, {
    delimiter: "/",
  });

  const arrayAttr = Object.keys(uskData).reduce((acc, key) => {
    if (unflattenedKeys.has(key)) {
      acc[key] = uskData[key];
    }
    return acc;
  }, {});

  return {
    ...unflattenedAttr,
    ...arrayAttr,
  };
};

// const result = convertUskDataToAmzData(
//   {
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
//   },
//   transformSchema
// );


export const convertAmzDataToUskData = (amzData, amzSchema) => {
  console.log(amzData,amzSchema);
  
  const unflattenedKeys = new Set(
    Object.keys(amzSchema.properties).filter((key) => {
      const property = amzSchema.properties[key];
      if (property.maxUniqueItems > 1 && !complexAttributes.includes(key)) {
        return true;
      }

      return false;
    }),
  );

  const flattenedAttr = Object.keys(amzData).reduce((acc, key) => {
    if (!unflattenedKeys.has(key)) {
      acc[key] = amzData[key];
    }
    return acc;
  }, {});

  const unflattenedAttr = Object.keys(amzData).reduce((acc, key) => {
    if (unflattenedKeys.has(key)) {
      acc[key] = amzData[key];
    }
    return acc;
  }, {});

  return {
    ...flatten(flattenedAttr, { delimiter: "/" }),
    ...unflattenedAttr,
  };
};

// const schema = JSON.parse(
//   fs.readFileSync("./schema/SHOES_SCHEMA.json", "utf8")
// );

// const result1 = convertAmzDataToUskData(
//   {
//     item_name: [
//       {
//         value: "myval",
//         language_tag: "en_IN",
//       },
//     ],
//     heel: [
//       {
//         height: [
//           {
//             decimal_value: 1,
//             unit: "centimeters",
//           },
//         ],
//         type: [
//           {
//             value: "Block Heel",
//             language_tag: "en_IN",
//           },
//         ],
//       },
//     ],
//     insole: [
//       {
//         material: [
//           {
//             value: "Cotton",
//             language_tag: "en_IN",
//           },
//         ],
//       },
//     ],
//     master_pack_dimensions: [
//       {
//         height: {
//           value: 1,
//           unit: "angstrom",
//         },
//         length: {
//           value: 1,
//           unit: "angstrom",
//         },
//         width: {
//           value: 1,
//           unit: "angstrom",
//         },
//       },
//     ],
//     externally_assigned_product_identifier: [
//       {
//         type: "ean",
//         value: "myval",
//       },
//     ],
//     supplier_declared_has_product_identifier_exemption: [
//       {
//         value: false,
//       },
//     ],
//     bullet_point: [
//       {
//         value: "bullet1",
//         language_tag: "en_IN",
//       },
//     ],
//   },
//   schema
// );


const tranformObject = (obj, token) => {
  const allLanguageTag = new Set(
    Object.keys(obj)
      .filter((key) => key.includes(token))
      .map((key) => key.split(`/${token}`)[0]),
  );

  const otherKeys = Object.keys(obj).filter((key) => !key.includes(token));

  const result = otherKeys.reduce((acc, key) => {
    const newKey = key.split("/").reverse().slice(1).reverse().join("/");
    if (allLanguageTag.has(newKey)) {
      acc[key] = obj[key];
      acc[`${newKey}/${token}`] = obj[`${newKey}/${token}`];
    } else {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

  return result;
};

function orderSchema(originalSchema, transformedObj) {
  return Object.keys(originalSchema.properties).reduce((acc, baseKey) => {
    Object.keys(transformedObj.properties).forEach((key) => {
      if (key === baseKey || key.startsWith(`${baseKey}/`)) {
        acc[key] = transformedObj.properties[key];
      }
    });
    return acc;
  }, {});
}
