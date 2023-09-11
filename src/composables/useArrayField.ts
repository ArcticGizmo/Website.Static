import { type MaybeRef, computed, unref } from 'vue';
import { useFieldArray, useFormErrors } from 'vee-validate';

export const useArrayField = <T>(arrayPath: MaybeRef<string>) => {
  const data = useFieldArray<T>(arrayPath);
  const allErrors = useFormErrors();
  const errors = computed(() => {
    const path = unref(arrayPath);
    const errs: Record<string, string> = {};

    Object.entries(allErrors.value).forEach(([key, value]) => {
      if (key.startsWith(path)) {
        const keyMatcher = new RegExp(`${path}\\[(?<index>\\d)\\]`, 'g');
        const match = keyMatcher.exec(key);
        const index = match!.groups!['index'];
        errs[index] = value!;
      }
    });
    return errs;
  });

  const setValue = (values: T[]) => {
    const len = values.length;

    if (len === 0) {
      data.fields.value = [];
      return;
    }

    const lastIndex = len - 1;

    data.fields.value = values.map((v, index) => {
      return {
        value: v,
        key: index,
        isFirst: index === 0,
        isLast: index === lastIndex,
      };
    });
  };

  const push = (value: T) => {
    const len = data.fields.value.length;
    data.fields.value[len - 1];
    data.fields.value.push({
      value,
      key: len,
      isFirst: len == 0,
      isLast: true,
    });
  };

  const remove = (index: number) => {
    data.fields.value.splice(index, 1);
    const lastIndex = data.fields.value.length - 1;
    data.fields.value.forEach((v, index) => {
      v.key = index;
      v.isFirst = index === 0;
      v.isLast = index === lastIndex;
    });
  };

  const rawValues = computed(() => data.fields.value.map(v => v.value));

  return { ...data, push, remove, setValue, rawValues, errors };
};
