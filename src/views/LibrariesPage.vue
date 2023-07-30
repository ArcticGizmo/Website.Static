<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h4 class="text-h4 pb-16">Libraries Page</h4>

      <v-btn size="x-large" color="primary" @click="onGetLibraries()">Get Libraries</v-btn>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useHttp } from '@/composables/http';
import { ref } from 'vue';
import type { Library } from '@/types/library';

const { http } = useHttp();

const libraries = ref<Library[]>([]);

const onGetLibraries = async () => {
  libraries.value = await http('libraries').get().json<Library[]>();
};
</script>

<style scoped></style>
