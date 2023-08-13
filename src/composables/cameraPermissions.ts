import { ref } from 'vue';

const requesting = ref(false);
const allowed = ref(false);
const rejected = ref(false);

const requestPermission = async () => {
  try {
    requesting.value = true;
    await navigator.mediaDevices.getUserMedia({ video: true });
    allowed.value = true;
  } catch (error: any) {
    rejected.value = true;
  } finally {
    requesting.value = false;
  }
};

export const useCameraPermissions = () => {
  return { requestPermission, allowed, rejected, requesting };
};
