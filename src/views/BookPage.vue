<template>
  <v-container class="fill-height justify-center">
    <v-responsive v-if="notFound" class="text-center">
      <h2 class="mb-4">Where'd it go??</h2>
      <p>We could not find the book you were looking for</p>
      <p>... sorry about that</p>
      <v-btn class="mt-4" color="primary" @click="router.back()">Back</v-btn>
    </v-responsive>
    <v-responsive v-else-if="book" class="text-center fill-height" max-width="750px">
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
          </v-col>
          <v-col align-self="center">
            <v-text-field variant="solo" readonly label="Title" :model-value="book.content.title" />
            <v-text-field label="ISBN" readonly variant="solo" :model-value="book.content.isbn" />
            <v-combobox
              label="Authors"
              variant="solo"
              readonly
              :model-value="book.content.authors"
              chips
              multiple
            />
            <v-combobox
              label="Tags"
              variant="solo"
              readonly
              :model-value="book.content.tags"
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
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { useHttp } from '@/composables/http';
import { useDialog } from '@/composables/dialog';
import router from '@/router';
import { Book, BookContent } from '@/types/library';
import { onMounted } from 'vue';
import { ref } from 'vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';
import BookFormModal from '@/modals/BookFormModal.vue';
import { useModalController } from '@/composables/modal';

const props = defineProps<{ bookId: string }>();

const book = ref<Book>();
const notFound = ref(false);

const { http } = useHttp();
const dialogController = useDialog();
const modalController = useModalController();

onMounted(() => {
  fetchBook();
});

const fetchBook = async () => {
  notFound.value = false;
  book.value = await http('book/')
    .get(props.bookId)
    .notFound(() => (notFound.value = true))
    .json<Book>();
};

const onBack = () => router.back();

const onEdit = async () => {
  const content = book.value?.content;
  if (!content) {
    return;
  }
  const updatedContent = await modalController.show<BookContent>({
    component: BookFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { content },
  });

  if (!updatedContent) {
    return;
  }

  await http(`book/${props.bookId}`).put(updatedContent).res();
  await fetchBook();
};

const onDelete = async () => {
  const resp = await dialogController.confirmCancel({
    title: 'Delete Book',
    message: 'Once the book is deleted it will be gone forever',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  if (resp !== 'confirm') {
    return;
  }

  const deleteResp = await http(`book/${props.bookId}`).delete().res();

  if (deleteResp.ok) {
    router.back();
  }
};
</script>

<style scoped></style>
