<template>
  <v-card>
    <v-card-title class="text-h5"> {{ title }}</v-card-title>
    <v-card-text v-if="message">{{ message }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="tonal" @click="modal.close('confirm')">
        {{ confirmText || 'Confirm' }}
      </v-btn>
      <v-btn color="primary" @click="modal.close('cancel')">
        {{ cancelText || 'Cancel' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';

defineProps<{
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>();

const modal = useModal();
</script>
