import { debounce } from '@/util/debounce';
import { type Ref, ref, watch } from 'vue';

export const useDelayedRef = <T>(r: Ref<T>, delay: number) => {
  const delayedRef = ref<T>(r.value);

  const delayedSet = debounce((v: any) => (delayedRef.value = v), delay);

  watch(r, value => delayedSet(value));

  return delayedRef;
};
