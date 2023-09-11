<template>
  <v-card
    class="container p-relative"
    elevation="0"
    :height="height"
    :width="width"
    @click="onClick"
  >
    <ImageWithPlaceholder
      :title="!modelValue ? 'Add Image' : ''"
      class="dashed-border"
      :width="width"
      :height="height"
      :src="modelValue"
      :fallback-icon="fallbackIcon"
      error-icon="mdi-image-broken"
      @error="onImageError"
    />
    <div v-if="!noIcons" class="actions p-absolute ma-4">
      <v-btn size="x-small" icon @click.stop="onClick">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn class="ml-2" size="x-small" icon @click.stop="onClear">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImageWithPlaceholder from './ImageWithPlaceholder.vue';
import { useModalController } from '@/composables/modal';
import ImagePickerModal from '@/modals/ImagePickerModal.vue';

const props = defineProps({
  modelValue: String,
  fallbackIcon: { type: String, default: 'mdi-image-plus' },
  height: String,
  width: String,
  maxFileSize: { type: Number, default: 10_000_000 },
  noIcons: Boolean,
});

const emits = defineEmits<{
  'update:model-value': [value: string | undefined];
  cleared: [];
  changed: [value: string | undefined];
}>();

const modalController = useModalController();

const errorMessage = ref<string>();

const onImageError = () => {
  errorMessage.value = 'Something is wrong with the image!';
};

const onClick = async () => {
  const result = await modalController.show<string>({
    component: ImagePickerModal,
    props: {
      modelValue: props.modelValue,
      fallbackIcon: props.fallbackIcon,
      maxFileSize: props.maxFileSize,
    },
    options: { maxWidth: '500px' },
  });

  if (!result) {
    return;
  }

  emits('update:model-value', result.value);

  if (result.value !== props.modelValue) {
    emits('changed', result.value);
  }

  if (!result.value && !!props.modelValue) {
    emits('cleared');
  }
};

const onClear = () => {
  console.dir('cleared');
  emits('cleared');
  emits('update:model-value', undefined);
};
</script>

<style scoped>
.p-relative {
  position: relative;
  /* display: inline-block; */
}

.p-absolute {
  position: absolute;
}
.actions {
  top: 0;
  right: 0;
}

.dashed-border {
  border: 1px dashed gray;
}
</style>
