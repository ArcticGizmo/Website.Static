<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h2>Security</h2>
      <pre>{{ user }}</pre>
      <code>{{ token }}</code>
      <br />
      <v-btn @click="onFetchBacon()">Get Bacon</v-btn>
      <v-btn @click="onFetchAdmin()">Get Admin</v-btn>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth0';
import { useToast } from 'vue-toast-notification';
import { ref } from 'vue';
import { useHttp } from '@/composables/http';

const token = ref('');

const { user, getAccessToken } = useAuth();
const toast = useToast({ position: 'top' });
const { http } = useHttp();

getAccessToken()
  .then(t => (token.value = t))
  .catch(e => console.error(e));

const request = async (url: string) => {
  try {
    const resp = await http(url).get().res();
    console.dir(resp);
    if (resp && resp.status === 200) {
      toast.success('Wooo it worked');
    }
  } catch (error) {
    console.error(error);
    toast.error(`Really Failed`);
  }
};

const onFetchBacon = async () => request('configuration/bacon');
const onFetchAdmin = async () => request('configuration/admin');
</script>

<style scoped>
pre {
  text-align: left;
}
</style>
