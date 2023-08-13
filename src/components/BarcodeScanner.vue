<template>
  <div class="barcode-scanner">
    <video v-if="show" id="video" ref="scanner" class="h-100 w-100" :class="{ flipped }" />
    <v-row class="ma-0">
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
      <v-btn class="ma-3" style="height: 3.5rem" @click="flipped = !flipped">
        <v-icon size="large">mdi-flip-horizontal</v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { BrowserMultiFormatReader, Exception } from '@zxing/library';

const emits = defineEmits<{
  decoded: [value: string];
}>();

const flipped = ref(false);
const show = ref(true);

const scanner = new BrowserMultiFormatReader();

const devices = ref<MediaDeviceInfo[]>([]);

const selectedDevice = ref<MediaDeviceInfo>();

onMounted(async () => {
  devices.value = await scanner.listVideoInputDevices();
  onSetDevice(devices.value[0]);
});

onBeforeUnmount(() => {
  scanner.reset();
  scanner.stopContinuousDecode();
  scanner.stopAsyncDecode();
  show.value = false;
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

.flipped {
  transform: scaleX(-1);
}
</style>
