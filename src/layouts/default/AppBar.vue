<template>
  <v-app-bar flat>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggleNavBar" />
    </template>
    <template v-slot:append>
      <v-btn outline v-if="!user" @click="login"> Log In </v-btn>
      <v-menu v-else>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar>
              <v-img :src="user.picture" alt="Profile Picture" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="{ name: 'MyProfile' }">Profile</v-list-item>
          <v-list-item @click="logout">Logout</v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="navBarOpen" temporary>
    <v-list>
      <router-link custom v-for="route in filteredRoutes" :key="route.path" :to="route.path">
        <v-list-item
          :to="route.path"
          :prepend-icon="route.meta?.icon"
          :title="route.meta?.title"
          :value="route.name"
        />
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { routes } from '@/router';
import { useNavigation } from '@/composables/navigation';
import { computed } from 'vue';
import { useAuth } from '@/composables/auth0';

const { navBarOpen, toggleNavBar } = useNavigation();
const { user, login, logout } = useAuth();

const filteredRoutes = computed(() => {
  return routes.filter(r => r.meta?.title);
});
</script>
