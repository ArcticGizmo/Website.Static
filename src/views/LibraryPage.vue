<template>
  <BasePage :loading="getBooks.isLoading">
    <v-text-field
      class="mb-2"
      v-model="searchText"
      label="An adventure awaits ..."
      prepend-inner-icon="mdi-magnify"
      single-line
      hide-details
      clearable
      @input="getBooks.refetch()"
      @click:clear="getBooks.refetch()"
    >
      <template #append>
        <v-btn color="primary" icon="mdi-plus" @click="onCreate()"></v-btn>
      </template>
    </v-text-field>

    <CardList
      :items="books"
      :has-more="getBooks.hasNextPage"
      :is-loading="getBooks.isLoading"
      @load-more="getBooks.fetchNextPageDebounced()"
    >
      <template #item="{ item }">
        <BookCard :book="item" @click="onSelect(item.id)" />
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
import BasePage from './BasePage.vue';
import CardList from '@/components/CardList.vue';
import { useBooks } from '@/composables/api/books';

const props = defineProps<{
  libraryId: string;
}>();

const modalController = useModalController();

const searchText = ref<string>();

const { books, getBooks } = useBooks(props.libraryId, searchText);

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
</script>
