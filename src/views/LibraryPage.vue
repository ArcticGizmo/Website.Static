<template>
  <BasePage :loading="getBooks.isInitialLoading">
    <v-text-field
      class="mb-2"
      v-model="searchText"
      label="An adventure awaits ..."
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      clearable
      @click:clear="searchText = ''"
    >
      <template #append>
        <v-btn class="ml-n2 mr-2" variant="text" icon="mdi-sort" @click="onSort()"></v-btn>
        <v-btn color="primary" icon="mdi-plus" @click="onCreate()"></v-btn>
      </template>
    </v-text-field>

    <CardList
      :items="books"
      :has-more="getBooks.hasNextPage"
      :is-loading="getBooks.isFetchingNextPage"
      @load-more="getBooks.fetchNextPageDebounced()"
    >
      <template #item="{ item }">
        <BookCard :book="item" :key="item.id" @click="onSelect(item.id)" />
      </template>
    </CardList>
  </BasePage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BookCard from '@/components/BookCard.vue';
import router from '@/router';
import { useModalController } from '@/composables/modal';
import BookFormModal from '@/modals/BookFormModal.vue';
import SortOptionDialog from '@/modals/SortOptionDialog.vue';
import BasePage from './BasePage.vue';
import CardList from '@/components/CardList.vue';
import { useBooks } from '@/composables/api/books';
import { useDelayedRef } from '@/composables/delayedRef';
import type { SortField } from '@/types/api';

const SORT_OPTIONS: SortField[] = [
  { name: 'Author', ascending: true, query: 'author|series|bookInSeries|title' },
  { name: 'Author', ascending: false, query: 'author:-1|series|bookInSeries|title' },
  { name: 'Title', ascending: true, query: 'title' },
  { name: 'Title', ascending: false, query: 'title:-1' },
];

const props = defineProps<{
  libraryId: string;
}>();

const modalController = useModalController();

const searchText = ref<string>();
const sortBy = ref<SortField>(SORT_OPTIONS[0]);
const delayedSearchText = useDelayedRef(searchText, 500);

const { books, getBooks } = useBooks(props.libraryId, delayedSearchText, sortBy);

const onCreate = async () => {
  const result = await modalController.show<'created'>({
    component: BookFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { libraryId: props.libraryId },
  });

  if (result?.value === 'created') {
    await getBooks.refetch();
  }
};

const onSelect = (bookId?: string) => {
  router.push({ name: 'Book', params: { bookId } });
};

const onSort = async () => {
  const result = await modalController.show<SortField>({
    component: SortOptionDialog,
    options: { maxWidth: '500px' },
    props: { value: sortBy.value, options: SORT_OPTIONS },
  });

  if (result?.value) {
    sortBy.value = result.value;
  }
};
</script>
