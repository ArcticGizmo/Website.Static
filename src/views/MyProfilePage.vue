<template>
  <v-container fill-height max-width="500px">
    <PageLoadingSpinner :loading="isLoading" />
    <template v-if="profile">
      <h3>Id</h3>
      <p>{{ profile.id }}</p>
      <br />
      <h3>Name</h3>
      <p>{{ profile.userInfo.name }}</p>
      <br />
      <h3>Email</h3>
      <p>{{ profile.userInfo.email }}</p>
      <br />
      <h3>Roles</h3>
      <p>{{ profile.roles.join(', ') }}</p>
    </template>
    <br />
    <v-btn color="primary" @click="logout">Logout</v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/auth0';
import type { Profile } from '@/types/profile';
import { useHttp } from '@/composables/http';
import PageLoadingSpinner from '@/components/PageLoadingSpinner.vue';

const { logout } = useAuth();
const { http } = useHttp();

const profile = ref<Profile>();
const isLoading = ref(true);

onMounted(async () => {
  // load profile
  profile.value = await http('profile').get().json<Profile>();
  isLoading.value = false;
});
</script>

<style scoped>
.v-layout {
  border: 1px solid orange;
}
</style>
