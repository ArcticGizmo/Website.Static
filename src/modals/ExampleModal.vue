<template>
  <v-card>
    This is some text {{ title }}
    <v-btn @click="modal.close(66)">Close</v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';

const modal = useModal();

defineProps<{ title: string }>();
</script>
