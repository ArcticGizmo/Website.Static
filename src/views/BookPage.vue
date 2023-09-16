<template>
  <BasePage max-width="750px" :loading="getBook.isLoading">
    <v-row class="ma-1 mb-4">
      <v-btn size="small" icon="mdi-arrow-left" @click="onBack()" />
      <v-spacer />
      <v-btn color="primary" @click="onEdit">Edit</v-btn>
      <v-btn color="error" @click="onDelete">Delete</v-btn>
    </v-row>
    <v-card v-if="book" class="pa-4" border rounded elevation="4">
      <v-row>
        <v-col cols="4">
          <ImageWithPlaceholder
            class="fill-height"
            :src="book.content.coverImageUrl"
            height="250"
          />
          <div class="icons">
            <v-tooltip v-if="book.content.wishlist" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props">mdi-tag-heart-outline</v-icon>
              </template>
              Wishlist
            </v-tooltip>

            <v-tooltip v-if="book.content.read" location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props">mdi-check</v-icon>
              </template>
              Read
            </v-tooltip>
          </div>
        </v-col>
        <v-col align-self="center">
          <v-text-field label="Title" variant="solo" readonly :model-value="book.content.title" />
          <v-text-field label="ISBN" readonly variant="solo" :model-value="book.content.isbn" />
          <v-text-field label="Series (#No)" readonly variant="solo" :model-value="seriesText" />
          <v-combobox
            label="Authors"
            variant="solo"
            readonly
            :model-value="book.content.authors"
            chips
            multiple
          />

          <v-text-field
            label="Pages"
            readonly
            variant="solo"
            :model-value="book.content.pageCount"
          />
        </v-col>
      </v-row>
      <v-rating
        class="text-center"
        label="Rating"
        readonly
        :model-value="book.content.rating"
        length="5"
        half-increments
        size="x-large"
        color="grey"
        active-color="orange"
      />
      <v-combobox
        label="Tags"
        variant="solo"
        readonly
        :model-value="book.content.tags"
        chips
        multiple
      />
      <v-textarea label="Notes" variant="solo" readonly :model-value="book.content.notes" />
    </v-card>
  </BasePage>
</template>

<script lang="ts" setup>
import { useDialog } from '@/composables/dialog';
import router from '@/router';
import { computed } from 'vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import BookFormModal from '@/modals/BookFormModal.vue';
import { useModalController } from '@/composables/modal';
import BasePage from './BasePage.vue';
import { useBook, useDeleteBook } from '@/composables/api/books';

const props = defineProps<{ bookId: string }>();

const dialogController = useDialog();
const modalController = useModalController();
const { deleteBook } = useDeleteBook();
const { book, getBook } = useBook(props.bookId);

const seriesText = computed(() => {
  const b = book.value;
  if (!b) {
    return;
  }
  const { series, bookInSeries } = b.content;
  if (!series) {
    return '';
  }

  if (!bookInSeries) {
    return series;
  }

  return `${series} #${bookInSeries}`;
});

const onBack = () => router.back();

const onEdit = async () => {
  const content = book.value?.content;
  if (!content) {
    return;
  }
  const result = await modalController.show<'updated'>({
    component: BookFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { id: props.bookId, content },
  });

  if (result?.value === 'updated') {
    await getBook.refetch();
  }
};

const onDelete = async () => {
  const resp = await dialogController.confirmCancel({
    title: 'Delete Book',
    message: 'Once the book is deleted it will be gone forever',
    confirmText: 'Delete',
    confirmColor: 'error', 
    cancelText: 'Cancel',
  });

  if (resp !== 'confirm') {
    return;
  }

  await deleteBook.mutateAsync(props.bookId);
  router.back();
};
</script>

<style scoped>
.icons {
  position: absolute;
  top: 0.5rem;
}
</style>
