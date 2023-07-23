<template>
  <v-overlay class="page-loading-spinner" :model-value="loading" persistent opacity="0.5">
    <v-progress-circular indeterminate size="80" />
  </v-overlay>
</template>

<script setup lang="ts">
defineProps<{ loading: boolean }>();
</script>

<style>
.page-loading-spinner .v-overlay__content {
  margin: auto;
  position: relative;
}
</style>
