import { ref } from 'vue';

const BLACKLIST = ['camera2 3, facing front', 'camera2 2, facing back'];

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

const getDevices = async (): Promise<MediaDeviceInfo[]> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(d => d.kind === 'videoinput' && !BLACKLIST.includes(d.label));
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getBackCamera = async (): Promise<MediaDeviceInfo | undefined> => {
  const devices = await getDevices();
  return devices.find(d => d.label.includes('back'));
};

export const useCamera = () => {
  return { requestPermission, allowed, rejected, requesting, getDevices, getBackCamera };
};
