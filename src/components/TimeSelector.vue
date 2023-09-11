<template>
  <v-card class="time-selector" elevation="0">
    <v-card-subtitle class="pa-0 mt-1">
      {{ label || 'Time' }}
    </v-card-subtitle>
    <v-card-text class="pa-0 d-inline-flex">
      <v-select
        :model-value="pad(modelValue?.hour)"
        :items="HOURS"
        variant="outlined"
        hide-details
        density="compact"
        @update:model-value="updateValue($event, modelValue?.minute)"
      />
      <v-select
        :model-value="pad(modelValue?.minute)"
        :items="MINUTES"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="updateValue(modelValue?.hour, $event)"
      />
      <v-icon class="my-auto" @click="updateValue(0, 0)">mdi-close</v-icon>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { TimeComponents } from '@/types/time';

const pad = (value?: number) => `${value}`.padStart(2, '0');

const HOURS = [1, 2, 3, 4, 5].map(e => e.toString());
const MINUTES = [...Array(60).keys()].map(pad);

defineProps<{ label?: string; modelValue?: TimeComponents }>();

const emits = defineEmits<{
  'update:model-value': [value?: TimeComponents];
}>();

const updateValue = (hour?: number, minute?: number) => {
  hour = Number(hour || 0);
  minute = Number(minute || 0);
  emits('update:model-value', { hour, minute });
};
</script>

<style>
.time-selector .v-field__append-inner {
  display: none !important;
}
</style>

<style scoped>
.time-selector .v-select {
  width: 3.5rem;
}
</style>
