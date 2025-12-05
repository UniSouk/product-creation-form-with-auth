import { useEffect } from 'react';
import { UseFormSetValue, FieldPath, FieldValues } from 'react-hook-form';

interface UseSpaceControlOptions {
  trimStart?: boolean;
  limitTrailingSpaces?: boolean;
  shouldValidate?: boolean;
  shouldDirty?: boolean;
}

const useSpaceControl = <T extends FieldValues>(
  fieldValue: string | undefined,
  setValue: UseFormSetValue<T>,
  fieldName: FieldPath<T>,
  options: UseSpaceControlOptions = {}
): void => {
  const {
    trimStart = true,
    limitTrailingSpaces = true,
    shouldValidate = true,
    shouldDirty = true
  } = options;

  useEffect(() => {
    if (fieldValue) {
      let updatedValue = fieldValue;
      let shouldUpdate = false;

      // Handle leading spaces - remove all leading spaces
      if (trimStart) {
        const trimmedStart = fieldValue.trimStart();
        if (fieldValue !== trimmedStart) {
          updatedValue = trimmedStart;
          shouldUpdate = true;
        }
      }

      // Handle trailing spaces - allow only one space at the end
      if (limitTrailingSpaces && updatedValue.length > 1) {
        const hasMultipleTrailingSpaces = /\s{2,}$/.test(updatedValue);
        if (hasMultipleTrailingSpaces) {
          updatedValue = updatedValue.replace(/\s{2,}$/, ' ');
          shouldUpdate = true;
        }
      }

      // Update only if changes were made
      if (shouldUpdate) {
        setValue(fieldName, updatedValue as any, {
          shouldValidate,
          shouldDirty,
        });
      }
    }
  }, [fieldValue, setValue, fieldName, trimStart, limitTrailingSpaces, shouldValidate, shouldDirty]);
};

export default useSpaceControl;