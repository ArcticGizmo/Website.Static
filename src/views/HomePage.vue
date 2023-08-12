<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h2>Welcome</h2>
      <a target="_blank" href="https://pictogrammers.com/library/mdi/">MDI Icons</a>
      <video ref="videoRef" style="width: 300px; height: 300px; border: 1px solid orange" />
      <v-btn @click="camera.stop()">Pause</v-btn>
      <v-btn @click="camera.start()">Play</v-btn>
      {{ camera.isErrored }} -- {{ camera.permissionDenied }}
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { useCamera } from '@/composables/camera';
import { onMounted } from 'vue';
import { ref } from 'vue';

const videoRef = ref<HTMLVideoElement>();

const camera = useCamera();

onMounted(() => {
  camera.bindTo(videoRef.value!);
});
</script>
