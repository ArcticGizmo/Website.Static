<template>
  <ModalProvider>
    <DefaultLayout />
  </ModalProvider>
</template>

<script lang="ts" setup>
import DefaultLayout from '@/layouts/default/Default.vue';
import ModalProvider from './components/ModalProvider.vue';
</script>
