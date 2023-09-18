<template>
  <v-card class="ma-4 pa-6">
    <ImageWithPlaceholder
      class="mb-3"
      :src="src"
      height="200px"
      :fallback-icon="fallbackIcon"
      error-icon="mdi-image-broken"
      @error="onImageError"
    />
    <v-text-field
      :model-value="src"
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
    <br />

    <div class="w-50 d-flex">
      <v-btn block color="primary" @click="onSelect()">Select</v-btn>
      <v-btn block color="error" @click="onClear()">Clear</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';
import { ref } from 'vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import { watch, onMounted } from 'vue';

interface ChangeEvent {
  target: { value?: string };
}

const props = defineProps({
  modelValue: String,
  fallbackIcon: String,
  maxFileSize: { type: Number, default: 10_000_000 },
  maxLength: { type: Number, default: 320 },
});

const modal = useModal();

const src = ref<string>();
const fileInput = ref();
const cameraInput = ref();
const fileValue = ref();
const errorMessage = ref<string>();

onMounted(() => {
  src.value = props.modelValue;
});

const onUploadFile = () => {
  fileInput.value.click();
};

const onTakePicture = () => {
  cameraInput.value.click();
};

const onUrlChange = (event: ChangeEvent) => {
  src.value = event.target.value;
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
    const base64 = await getBase64(img);
    src.value = await resizeImage(base64, props.maxLength);
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

const onSelect = () => {
  modal.close(src.value);
};

const onClear = () => {
  modal.close(null);
};

const resizeImage = async (
  base64: string | undefined,
  maxLength: number,
): Promise<string | undefined> => {
  if (!base64) {
    return;
  }
  return new Promise(resolve => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const { width, height } = scale(img.width, img.height, maxLength);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
  });
};

const scale = (width: number, height: number, maxLength?: number) => {
  if (!maxLength) {
    return { width, height };
  }

  if (width < maxLength && height < maxLength) {
    return { width, height };
  }

  if (width > height) {
    return { width: maxLength, height: Math.trunc((height / width) * maxLength) };
  }

  return { width: Math.trunc((width / height) * maxLength), height: maxLength };
};
</script>
