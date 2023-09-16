<template>
  <BasePage max-width="750px" :loading="getRecipe.isLoading">
    <v-row class="ma-1 mb-4">
      <v-btn size="small" icon="mdi-arrow-left" @click="onBack()" />
      <v-spacer />
      <v-btn color="primary" @click="onEdit">Edit</v-btn>
      <v-btn color="error" @click="onDelete">Delete</v-btn>
    </v-row>
    <v-card v-if="recipe" class="pa-4 text-left" border rounded elevation="4">
      <v-card-title>{{ recipe.content.name }}</v-card-title>
      <div class="mx-4">
        <span class="pr-3"><v-icon>mdi-clock</v-icon>{{ time }}</span>
        <span><v-icon>mdi-account</v-icon>{{ recipe.content.peopleCount || 0 }}</span>
      </div>

      <!-- Time, servings -->
      <div class="tags py-3 px-4">
        <v-chip v-for="(tag, index) in recipe.content.tags" color="blue" size="small" :key="index">
          {{ tag }}
        </v-chip>
      </div>
      <ImageWithPlaceholder
        icon-size="x-large"
        contain
        height="15rem"
        :src="recipe.content.imageUrl"
        fallback-icon="mdi-hamburger"
      />

      <v-divider class="ma-2" />

      <!-- Ingredients list -->
      <h3 class="ml-3">Ingredients</h3>
      <ul class="ml-3" style="list-style-position: inside">
        <li v-for="(item, key) in recipe.content.ingredients" :key="key">
          {{ item }}
        </li>
      </ul>

      <!-- Steps -->
      <v-divider class="ma-2" />

      <div class="ma-3" v-for="(step, index) in recipe.content.steps" :key="index">
        <h4>Step {{ index + 1 }}</h4>
        <v-textarea v-model="step.text" readonly variant="solo" auto-grow />
        <div class="d-inline-flex">
          <ImageWithViewer
            class="mx-1"
            v-for="(src, index) in step.imageUrls"
            :key="index"
            :src="src"
            height="100"
            width="100"
            with-border
          />
        </div>
        <v-divider class="ma-2" />
      </div>
    </v-card>
  </BasePage>
</template>

<script setup lang="ts">
import { useDialog } from '@/composables/dialog';
import router from '@/router';
import { useModalController } from '@/composables/modal';
import BasePage from './BasePage.vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import RecipeFormModal from '@/modals/RecipeFormModal.vue';
import ImageWithViewer from '@/components/ImageWithViewer.vue';
import { computed } from 'vue';
import { useDeleteRecipe, useRecipe } from '@/composables/api/recipes';

const props = defineProps<{ recipeId: string }>();

const pad = (value: any) => `${value}`.padStart(2, '0');

const time = computed(() => {
  const value = recipe.value?.content.time || { hour: 0, minute: 0 };
  return `${value.hour}:${pad(value.minute)}`;
});

const dialogController = useDialog();
const modalController = useModalController();
const { deleteRecipe } = useDeleteRecipe();
const { recipe, getRecipe } = useRecipe(props.recipeId);

const onBack = () => router.back();

const onEdit = async () => {
  const content = recipe.value?.content;
  if (!content) {
    return;
  }
  const result = await modalController.show<'updated'>({
    component: RecipeFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { id: props.recipeId, content },
  });

  if (result?.value === 'updated') {
    await getRecipe.refetch();
  }
};

const onDelete = async () => {
  const resp = await dialogController.confirmCancel({
    title: 'Delete Recipe',
    message: 'Once the recipe is deleted it will be gone forever',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  if (resp !== 'confirm') {
    return;
  }

  await deleteRecipe.mutateAsync(props.recipeId);
  router.back();
};
</script>
