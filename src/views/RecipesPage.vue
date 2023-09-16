<template>
  <BasePage :loading="getRecipes.isInitialLoading">
    <v-text-field
      class="mb-2"
      v-model="searchText"
      label="An adventure awaits ..."
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      clearable
      @input="getRecipes.refetch()"
      @click:clear="getRecipes.refetchDebounced()"
    >
      <template #append>
        <v-btn color="primary" icon="mdi-plus" @click="onCreate()"></v-btn>
      </template>
    </v-text-field>
    <CardList
      :items="recipes"
      :has-more="getRecipes.hasNextPage"
      :is-loading="getRecipes.isLoading"
      @load-more="getRecipes.fetchNextPageDebounced()"
    >
      <template #item="{ item }">
        <recipe-card :recipe="item" @click="onSelect(item.id)" />
      </template>
    </CardList>
  </BasePage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BasePage from './BasePage.vue';
import { useModalController } from '@/composables/modal';
import RecipeCard from '@/components/RecipeCard.vue';
import router from '@/router';
import RecipeFormModal from '@/modals/RecipeFormModal.vue';
import { useRecipes } from '@/composables/api/recipes';
import CardList from '@/components/CardList.vue';

const modalController = useModalController();

const searchText = ref<string>();

const { recipes, getRecipes } = useRecipes(searchText);

const onCreate = async () => {
  const resp = await modalController.show<'created'>({
    component: RecipeFormModal,
    options: { persistent: false, maxWidth: '750px' },
  });

  if (resp?.value === 'created') {
    await getRecipes.refetch();
  }
};

const onSelect = (recipeId?: string) => {
  router.push({ name: 'Recipe', params: { recipeId } });
};
</script>
