import { ref } from 'vue';

export interface DeviceInfo {
  readonly id: string;
}

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
    return devices.filter(d => d.kind === 'videoinput');
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getBackCamera = async (): Promise<MediaDeviceInfo | undefined> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    const trackLabel = stream.getVideoTracks()[0].label;
    const devices = await getDevices();
    return devices.find(d => d.label === trackLabel);
  } catch (error) {
    return;
  }
};

export const useCamera = () => {
  return { requestPermission, allowed, rejected, requesting, getDevices, getBackCamera };
};
