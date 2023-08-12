<template>
  <v-row class="my-4">
    <v-col>
      <ImageWithPlaceholder
        :width="width"
        :height="height"
        :src="modelValue"
        :fallback-icon="fallbackIcon"
        error-icon="mdi-image-broken"
        @error="onImageError"
      />
    </v-col>
    <v-col>
      <v-text-field
        :model-value="modelValue"
        label="Image Url"
        :error-messages="errorMessage"
        @input="errorMessage = undefined"
        @change="onUrlChange"
      />
      <!-- hidden and triggered by the file button instead -->
      <v-file-input ref="fileInput" v-show="false" v-model="fileValue" accept="image/*" />
      <v-file-input
        ref="cameraInput"
        v-show="false"
        v-model="fileValue"
        capture="environment"
        accept="image/*"
      />
      <v-btn block @click="onUploadFile"> Upload File<v-icon>mdi-file</v-icon> </v-btn>
      <br />
      <v-btn block @click="onTakePicture"> Take Picture<v-icon>mdi-camera</v-icon> </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImageWithPlaceholder from './ImageWithPlaceholder.vue';
import { watch } from 'vue';

interface ChangeEvent {
  target: { value?: string };
}

const props = defineProps({
  modelValue: String,
  fallbackIcon: String,
  height: String,
  width: String,
  maxFileSize: { type: Number, default: 10_000_000 },
});

const emits = defineEmits<{
  'update:model-value': [value: string | undefined];
}>();

const fileInput = ref();
const cameraInput = ref();
const fileValue = ref();
const errorMessage = ref<string>();

const onUploadFile = () => {
  fileInput.value.click();
};

const onTakePicture = () => {
  cameraInput.value.click();
};

const onUrlChange = (event: ChangeEvent) => {
  const url = event.target.value;
  emits('update:model-value', url);
};

const onImageError = () => {
  errorMessage.value = 'Something is wrong with the image!';
};

watch(fileValue, async value => {
  errorMessage.value = undefined;
  const img: File = value[0];
  if (!img) {
    return;
  }

  if (img.size > props.maxFileSize) {
    errorMessage.value = 'File too large!';
    return;
  }

  try {
    const url = await getBase64(img);
    emits('update:model-value', url);
  } catch (error) {
    errorMessage.value = 'Unable to convert image';
  }
});

const getBase64 = (file: File): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString());
    reader.onerror = error => reject(error);
  });
};
</script>
