<template>
  <v-img :src="src">
    <template #placeholder>
      <v-icon :size="iconSize" class="fill-height w-100" color="grey"> {{ fallbackIcon }}</v-icon>
    </template>
    <template #error>
      <v-icon :size="iconSize" class="fill-height w-100" color="grey">
        {{ errorIcon || fallbackIcon }}
      </v-icon>
    </template>
  </v-img>
</template>

<script setup lang="ts">
defineProps({
  src: String,
  fallbackIcon: { type: String, default: 'mdi-image-area' },
  errorIcon: String,
  iconSize: String,
});
</script>
