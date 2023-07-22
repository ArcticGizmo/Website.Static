<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h2>Profile</h2>
      <p>Not really much to do here at the moment ... sorry</p>
      <p>Guess you can logout if you want</p>
      <br />
      <v-btn color="primary" @click="logout">Logout</v-btn>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth0';

const { logout } = useAuth();
</script>
