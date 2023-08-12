<template>
  <v-container class="fill-height">
    <v-responsive v-if="notFound" class="text-center">
      <h2 class="mb-4">Where'd it go??</h2>
      <p>We could not find the library you were looking for</p>
      <p>... sorry about that</p>
      <v-btn class="mt-4" color="primary" @click="router.back()">Back</v-btn>
    </v-responsive>
    <v-responsive v-else-if="library.library?.id" class="text-center fill-height">
      <h4 class="text-h4 pb-16">{{ library.library.name }}</h4>
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
          <!-- <v-icon class="mr-3">mdi-dots-vertical</v-icon> -->
          <v-btn color="primary" icon="mdi-plus" @click="onCreate()"></v-btn>
        </template>
      </v-text-field>

      <v-lazy>
        <transition-group disabled="false">
          <book-card
            v-for="(book, index) in library.books"
            :key="index"
            :book="book"
            @click="onSelect(book.id)"
          />
        </transition-group>
      </v-lazy>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useHttp } from '@/composables/http';
import { ref, onMounted } from 'vue';
import type { LibraryWithBooks, BookContent, CreateBookReq } from '@/types/library';
import BookCard from '@/components/BookCard.vue';
import router from '@/router';
import { useModalController } from '@/composables/modal';
import BookFormModal from '@/modals/BookFormModal.vue';
import { debounce } from '@/util/debounce';

const props = defineProps<{
  libraryId: string;
}>();

const notFound = ref(false);
const searchText = ref<string>();

const { http } = useHttp();
const modalController = useModalController();

const library = ref<LibraryWithBooks>({
  library: { id: '', ownerUserId: '', name: '' },
  books: [],
});

onMounted(() => {
  fetchLibrary();
});

const fetchLibrary = async () => {
  notFound.value = false;

  library.value = await http(`library/${props.libraryId}`)
    .query({ searchText: searchText.value || undefined })
    .get()
    .notFound(() => (notFound.value = true))
    .json<LibraryWithBooks>();
};

const debouncedFetchLibrary = debounce(() => fetchLibrary(), 500);

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
  await fetchLibrary();
};

const onSelect = (bookId?: string) => {
  router.push({ name: 'Book', params: { bookId } });
};
</script>

<style scoped>
.v-lazy {
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 1rem;
}

@media screen and (max-width: 1450px) {
  .v-lazy {
    grid-template-columns: auto auto;
  }
}

@media screen and (max-width: 800px) {
  .v-lazy {
    grid-template-columns: auto;
  }
}
</style>
