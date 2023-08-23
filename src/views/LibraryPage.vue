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
      @input="debouncedFetchLibrary()"
      @click:clear="debouncedFetchLibrary()"
    >
      <template #append>
        <v-btn color="primary" icon="mdi-plus" @click="onCreate()"></v-btn>
      </template>
    </v-text-field>

    <v-lazy>
      <transition-group disabled="false">
        <book-card v-for="book in books" :key="book.id" :book="book" @click="onSelect(book.id)" />
      </transition-group>
    </v-lazy>
    <h3 v-if="noMore" class="ma-4">💙💚💛💜🧡</h3>
    <div ref="loadTrigger"></div>
    <v-progress-linear v-if="isLoadingMore" class="mt-4" color="primary" indeterminate />
  </BasePage>
</template>

<script setup lang="ts">
import { useHttp } from '@/composables/http';
import { ref, onMounted } from 'vue';
import type { Book, BookContent, CreateBookReq } from '@/types/library';
import BookCard from '@/components/BookCard.vue';
import router from '@/router';
import { useModalController } from '@/composables/modal';
import BookFormModal from '@/modals/BookFormModal.vue';
import { debounce } from '@/util/debounce';
import BasePage from './BasePage.vue';
import { useIntersectionObserver } from '@vueuse/core';

const PAGE_SIZE = 25;

const props = defineProps<{
  libraryId: string;
}>();

const loadTrigger = ref<HTMLElement>();

const initialLoad = ref(true);
const isLoadingMore = ref(false);
const notFound = ref(false);
const noMore = ref(false);
const pageNumber = ref(0);
const searchText = ref<string>();

useIntersectionObserver(loadTrigger, entries => {
  if (entries.some(e => e.isIntersecting)) {
    debouncedLoadMore();
  }
});

const { http } = useHttp();
const modalController = useModalController();

const books = ref<Book[]>([]);

onMounted(async () => {
  await fetchBooks();
  initialLoad.value = false;
});

const fetchBooks = async () => {
  pageNumber.value = 0;

  isLoadingMore.value = true;
  notFound.value = false;
  noMore.value = false;

  const query = {
    searchText: searchText.value || undefined,
    pageNumber: pageNumber.value,
    pageSize: PAGE_SIZE,
  };

  try {
    books.value = await http(`library/${props.libraryId}/books`)
      .query(query)
      .get()
      .notFound(() => (notFound.value = true))
      .json<Book[]>();

    if (books.value.length < query.pageSize) {
      noMore.value = true;
    }
  } finally {
    isLoadingMore.value = false;
    notFound.value = false;
  }
};

const loadMore = async () => {
  if (noMore.value) {
    return;
  }

  isLoadingMore.value = true;
  notFound.value = false;
  const nextPage = pageNumber.value + 1;

  const query = {
    searchText: searchText.value || undefined,
    pageNumber: nextPage,
    pageSize: PAGE_SIZE,
  };

  try {
    const newBooks = await http(`library/${props.libraryId}/books`)
      .query(query)
      .get()
      .notFound(() => (notFound.value = true))
      .json<Book[]>();

    if (newBooks.length < query.pageSize) {
      noMore.value = true;
    }

    if (newBooks.length >= query.pageSize) {
      pageNumber.value = nextPage;
    }

    books.value.push(...newBooks);
  } finally {
    isLoadingMore.value = false;
    notFound.value = false;
  }
};

const debouncedFetchLibrary = debounce(() => fetchBooks(), 500);

const debouncedLoadMore = debounce(() => loadMore(), 500);

const onCreate = async () => {
  const content = await modalController.show<BookContent>({
    component: BookFormModal,
    options: { persistent: false, maxWidth: '750px' },
  });
  if (!content) {
    return;
  }

  const req: CreateBookReq = { libraryId: props.libraryId, content };

  await http('book').post(req).res();
  await fetchBooks();
};

const onSelect = (bookId?: string) => {
  router.push({ name: 'Book', params: { bookId } });
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
