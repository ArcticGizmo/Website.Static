<template>
  <div class="barcode-scanner">
    <video id="video" ref="scanner" class="h-100 w-100" />
    <v-select
      class="pa-3 ma-0"
      variant="solo"
      :model-value="selectedDevice"
      :items="devices"
      item-title="label"
      return-object
      hide-details
      @update:model-value="onSetDevice"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { ref } from 'vue';

import { BrowserMultiFormatReader, Exception } from '@zxing/library';

const emits = defineEmits<{
  decoded: [value: string];
}>();

const scanner = new BrowserMultiFormatReader();

const devices = ref<MediaDeviceInfo[]>([]);

const selectedDevice = ref<MediaDeviceInfo>();

onMounted(async () => {
  devices.value = await scanner.listVideoInputDevices();
  onSetDevice(devices.value[0]);
});

onBeforeMount(() => {
  scanner.reset();
  selectedDevice.value = undefined;
});

const onSetDevice = (device?: MediaDeviceInfo) => {
  if (!device) {
    return;
  }

  selectedDevice.value = device;
  start();
};

const start = () => {
  const id = selectedDevice.value?.deviceId;
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
</style>
