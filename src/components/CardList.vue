<template>
  <v-lazy class="mb-2">
    <transition-group>
      <slot name="item" v-for="(item, index) in items" :item="item" :index="index"></slot>
    </transition-group>
  </v-lazy>
  <h3 v-if="!isLoading && !hasMore" class="ma-4">
    <slot name="no-more">💙💚💛💜🧡</slot>
  </h3>
  <div ref="loadTrigger"></div>
  <v-progress-linear v-if="isLoading" class="mt-4" color="primary" indeterminate />
</template>

<script setup lang="ts" generic="T">
import { useIntersectionObserver } from '@vueuse/core';
import { ref } from 'vue';

defineProps<{
  hasMore?: boolean;
  items: T[];
  isLoading?: boolean;
}>();

const emits = defineEmits<{
  loadMore: [];
}>();

const loadTrigger = ref<HTMLElement>();

useIntersectionObserver(loadTrigger, entries => {
  if (entries.some(e => e.isIntersecting)) {
    emits('loadMore');
  }
});
</script>

<style scoped>
.v-lazy {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media screen and (max-width: 1450px) {
  .v-lazy {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (max-width: 800px) {
  .v-lazy {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
