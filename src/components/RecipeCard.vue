<template>
  <v-card class="recipe-card text-left" border rounded elevation="4">
    <ImageWithPlaceholder
      icon-size="x-large"
      cover
      max-height="10rem"
      :src="recipe.content.imageUrl"
      fallback-icon="mdi-hamburger"
    />
    <v-card-title>{{ recipe.content.name }}</v-card-title>
    <div class="tags py-1 px-4">
      <v-chip v-for="(tag, index) in recipe.content.tags" color="blue" size="small" :key="index">
        {{ tag }}
      </v-chip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { Recipe } from '@/types/recipe';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';

defineProps<{ recipe: Recipe }>();
</script>

<style scoped>
.recipe-card {
  min-height: 12rem;
  user-select: none;
}

.v-img__error {
  border: 1px solid gray;
}
</style>
