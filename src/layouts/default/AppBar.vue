<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <!-- TODO: home button -->
      <v-btn icon @click="toggleNavBar">
        <v-icon icon="mdi-menu" />
      </v-btn>
    </v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="navBarOpen" temporary>
    <v-list>
      <router-link custom v-for="route in filteredRoutes" :key="route.path" :to="route.path">
        <v-list-item :to="route.path" :prepend-icon="route.meta?.icon" :title="route.meta?.title" :value="route.name" />
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { routes } from '@/router'
import { useNavigation } from '@/composables/navigation'
import { computed } from 'vue';

const { navBarOpen, toggleNavBar } = useNavigation();

const filteredRoutes = computed(() => {
  return routes.filter(r => r.meta?.title)
})

</script>
