<template>
  <BasePage :not-found="notFound" :loading="initialLoad">
    <v-text-field
      class="mb-2"
      v-model="searchText"
      label="An adventure awaits ..."
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      clearable
      @input="debounceFetchRecipes()"
      @click:clear="debounceFetchRecipes()"
    >
      <template #append>
        <v-btn color="primary" icon="mdi-plus" @click="onCreate()"></v-btn>
      </template>
    </v-text-field>
    <v-lazy>
      <transition-group disabled="false">
        <recipe-card
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          @click="onSelect(recipe.id)"
        />
      </transition-group>
    </v-lazy>
    <h3 v-if="noMore" class="ma-4">💙💚💛💜🧡</h3>
    <div ref="loadTrigger"></div>
    <v-progress-linear v-if="isLoadingMore" class="mt-4" color="primary" indeterminate />
  </BasePage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BasePage from './BasePage.vue';
import { useHttp } from '@/composables/http';
import { useModalController } from '@/composables/modal';
import type { Recipe, RecipeContent } from '@/types/recipe';
import { debounce } from '@/util/debounce';
import RecipeCard from '@/components/RecipeCard.vue';
import router from '@/router';
import RecipeFormModal from '@/modals/RecipeFormModal.vue';

const PAGE_SIZE = 25;

const { http } = useHttp();
const modalController = useModalController();

const notFound = ref(false);
const initialLoad = ref(true);
const isLoadingMore = ref(false);
const noMore = ref(false);
const pageNumber = ref(0);
const searchText = ref<string>();

const recipes = ref<Recipe[]>([]);

onMounted(async () => {
  await fetchRecipes();
  initialLoad.value = false;
});

const fetchRecipes = async () => {
  pageNumber.value = 0;

  isLoadingMore.value = false;
  notFound.value = false;
  noMore.value = false;

  const query = {
    searchText: searchText.value || undefined,
    pageNumber: pageNumber.value,
    pageSize: PAGE_SIZE,
  };

  try {
    recipes.value = await http(`recipes`)
      .query(query)
      .get()
      .notFound(() => (notFound.value = true))
      .json<Recipe[]>();

    if (recipes.value.length < query.pageSize) {
      noMore.value = true;
    }
  } finally {
    isLoadingMore.value = false;
    notFound.value = false;
  }
};

const debounceFetchRecipes = debounce(() => fetchRecipes(), 500);

// const debouncedLoadMore = debounce(() => loadMore(), 500);

const onCreate = async () => {
  const result = await modalController.show<RecipeContent>({
    component: RecipeFormModal,
    options: { persistent: false, maxWidth: '750px' },
  });
  if (!result || !result.value) {
    return;
  }

  await http('recipes').post(result.value).res();
  await fetchRecipes();
};

const onSelect = (recipeId?: string) => {
  router.push({ name: 'Recipe', params: { recipeId } });
};
</script>

<style scoped>
.v-lazy {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

@media screen and (max-width: 1450px) {
  .v-lazy {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (max-width: 800px) {
  .v-lazy {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
