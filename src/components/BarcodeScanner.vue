<template>
  <div class="barcode-scanner text-center">
    <div v-if="allowed" class="allowed">
      <video id="video" class="h-100 w-100" :class="{ flipped }" />
      <div class="ma-2 d-flex">
        <v-select
          class="py-3 ma-0"
          variant="solo"
          no-data-text="No devices found"
          :model-value="selectedDeviceId"
          :items="devices"
          item-value="deviceId"
          item-title="label"
          hide-details
          @update:model-value="onSetDevice"
        />
        <v-btn class="ml-2 my-3" style="height: 3.5rem" @click="flipped = !flipped">
          <v-icon size="large">mdi-flip-horizontal</v-icon>
        </v-btn>
      </div>
    </div>
    <v-card v-else-if="requesting" class="loading">
      <v-card-title>Requesting Permission</v-card-title>
      <v-card-text> Your browser should be asking for permission to your camera </v-card-text>
      <v-progress-circular class="ma-4" indeterminate size="60" />
    </v-card>
    <v-card v-else-if="rejected" class="rejected">
      <v-card-title>Permission Denied</v-card-title>
      <v-card-text>To scan barcodes, please allow access to your camera</v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType, Exception } from '@zxing/library';
import { useCamera } from '@/composables/camera';

const emits = defineEmits<{
  decoded: [value: string];
}>();

const flipped = ref(false);
const show = ref(true);

const hints = new Map();
const formats = [BarcodeFormat.EAN_13];
hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

const scanner = new BrowserMultiFormatReader(hints);

const devices = ref<MediaDeviceInfo[]>([]);

const selectedDeviceId = ref<string>();
const { requestPermission, allowed, rejected, requesting, getDevices, getBackCamera } = useCamera();

onMounted(async () => {
  if (!allowed.value && !rejected.value) {
    await requestPermission();
  }
  if (allowed.value) {
    await init();
  }
});

const init = async () => {
  devices.value = await getDevices();
  const backCamera = (await getBackCamera()) || devices.value[0];
  onSetDevice(backCamera.deviceId);
};

onBeforeUnmount(() => {
  scanner.reset();
  scanner.stopContinuousDecode();
  scanner.stopAsyncDecode();
  show.value = false;
});

const onSetDevice = (id?: string) => {
  if (!id) {
    return;
  }

  selectedDeviceId.value = id;
  start();
};

const start = () => {
  const id = selectedDeviceId.value;
  if (!id) {
    return;
  }
  scanner.decodeFromVideoDevice(id, 'video', (result, err) => {
    if (result) {
      emits('decoded', result.getText());
    }
    if (err && !(err instanceof Exception)) {
      console.error(err);
    }
  });
};
</script>

<style scoped>
.barcode-scanner {
  background-color: rgb(211, 211, 211);
}

.flipped {
  transform: scaleX(-1);
}
</style>
