import { ref } from 'vue';

export const useCamera = () => {
  let _element: HTMLVideoElement;
  const isErrored = ref(false);
  const permissionDenied = ref(false);

  const bindTo = async (element: HTMLVideoElement) => {
    _element = element;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      element.srcObject = stream;
      element.onloadedmetadata = () => {
        element.play();
      };
    } catch (error) {
      console.error(error);
      if (error === 'PERMISSION_DENIED') {
        permissionDenied.value = true;
      }
      isErrored.value = true;
    }
  };

  const start = () => {
    _element.play();
  };

  const stop = () => {
    _element.pause();
  };

  const requestPermission = () => {};

  return {
    isErrored,
    permissionDenied,
    start,
    stop,
    requestPermission,
    bindTo,
  };
};
