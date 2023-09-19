<template>
  <ImageWithPlaceholder
    class="image-with-viewer"
    :class="{ border: withBorder, 'can-hover': !!props.src }"
    v-bind="props"
    @click="onView()"
  />
</template>

<script setup lang="ts">
import { useModalController } from '@/composables/modal';
import ImageWithPlaceholder from './ImageWithPlaceholder.vue';
import ImageViewerModal from '@/modals/ImageViewerModal.vue';

const props = defineProps({
  src: String,
  fallbackIcon: { type: String, default: 'mdi-image-area' },
  errorIcon: String,
  iconSize: String,
  withBorder: Boolean,
});

const modalController = useModalController();

const onView = async () => {
  if (props.src) {
    await modalController.show({ component: ImageViewerModal, props: { src: props.src } });
  }
};
</script>

<style scoped>
.can-hover:hover {
  cursor: pointer;
  opacity: 0.9;
}

.with-border {
  border: 1px dashed gray;
}
</style>
