<template>
  <v-card class="barcode-scanner-modal">
    <BarcodeScanner @decoded="onDecoded" />
  </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';
import BarcodeScanner from '@/components/BarcodeScanner.vue';

const modal = useModal();

const onDecoded = (id?: string) => modal.close(id);
</script>

<style scoped>
.barcode-scanner-modal {
  min-height: 4rem;
}
</style>
