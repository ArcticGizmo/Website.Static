<template>
  <v-container class="d-flex justify-center" :class="{ 'fill-height': fillHeight }">
    <v-responsive class="text-center" :class="{ 'fill-height': fillHeight }" :max-width="maxWidth">
      <slot v-if="loading" name="loading">
        <v-progress-linear color="primary" indeterminate />
      </slot>
      <slot v-else-if="notFound" name="not-found">
        <h2 class="mb-4">Where'd it go??</h2>
        <p>we could not find what you were looking for</p>
        <p>... sorry about that</p>
        <v-btn class="mt-4" color="primary" @click="router.back()">Back</v-btn>
      </slot>
      <slot v-else></slot>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import router from '@/router';

defineProps<{ loading?: boolean; notFound?: boolean; maxWidth?: string; fillHeight?: boolean }>();
</script>
