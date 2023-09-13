<template>
  <v-responsive class="ma-auto">
    <ImageWithPlaceholder :src="src" width="80vw" height="80vh" />
    <v-overlay persistent :model-value="true" scrim="transparent" @click="modal.close()" />
  </v-responsive>
</template>

<script setup lang="ts">
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import { useModal } from '@/composables/modal';

defineProps<{ src?: string }>();

const modal = useModal();
</script>
