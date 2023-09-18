<template>
  <ModalProvider>
    <v-dialog :model-value="ready && !serverAlive" persistent>
      <v-container class="d-flex justify-center">
        <v-card class="pa-4 w-100 text-center" max-width="500px">
          <h3>Waiting for the server to wake up</h3>
          <p>It's a free server so it falls asleep alot</p>
          <v-progress-circular class="ma-4" indeterminate />
        </v-card>
      </v-container>
    </v-dialog>
    <DefaultLayout />
  </ModalProvider>
</template>

<script lang="ts" setup>
import DefaultLayout from '@/layouts/default/Default.vue';
import ModalProvider from './components/ModalProvider.vue';

import { useSimpleHttp } from '@/composables/http';
import { ref } from 'vue';
import { onMounted } from 'vue';

const READY_AFTER_MS = 2_000;
const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const CHECK_AFTER_FAILURE = 3_000;

const { http } = useSimpleHttp();

const ready = ref(false);

const serverAlive = ref(false);

const checkStatus = async () => {
  try {
    const resp = await http('healthz').get().res();
    serverAlive.value = resp.ok;
    setTimeout(() => checkStatus(), CHECK_INTERVAL_MS);
  } catch (error) {
    console.error(error);
    serverAlive.value = false;
    setTimeout(() => checkStatus(), CHECK_AFTER_FAILURE);
  }
};

onMounted(() => {
  setTimeout(() => (ready.value = true), READY_AFTER_MS);
});

checkStatus();
</script>
