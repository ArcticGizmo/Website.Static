<template>
  <v-responsive style="margin: auto">
    <v-card class="text-center" width="80vh" height="80vh">
      <ImageWithPlaceholder :src="src" />
    </v-card>
    <v-overlay persistent :model-value="true" scrim="transparent" @click="modal.close()" />
  </v-responsive>
</template>

<script setup lang="ts">
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import { useModal } from '@/composables/modal';

defineProps<{ src?: string }>();

const modal = useModal();
</script>
