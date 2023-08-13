<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5"> {{ isEdit ? 'Edit' : 'Create' }} Book</v-card-title>
    <v-btn class="my-2" color="primary" block @click="onScan()">
      Scan Barcode <v-icon>mdi-barcode</v-icon>
    </v-btn>
    <form @submit.prevent="onSubmit">
      <v-text-field
        label="Title"
        v-model="titleField.value.value"
        :counter="255"
        :error-messages="titleField.errorMessage.value"
      />
      <v-text-field
        label="ISBN"
        v-model="isbnField.value.value"
        :counter="13"
        :error-messages="isbnField.errorMessage.value"
      />
      <v-text-field
        label="Page Count"
        type="number"
        v-model="pageCountField.value.value"
        :error-messages="pageCountField.errorMessage.value"
      />
      <ImagePicker v-model="coverImageUrlField.value.value" height="250" />
      <v-combobox
        label="Authors"
        v-model="authorsField.value.value"
        chips
        multiple
        clearable
        closable-chips
        :error-messages="authorsField.errorMessage.value"
      />
      <v-combobox
        label="Tags"
        v-model="tagsField.value.value"
        chips
        multiple
        clearable
        closable-chips
        :error-messages="tagsField.errorMessage.value"
      />
      <v-row class="ma-0">
        <v-spacer @click="ratingField.value.value = 0"></v-spacer>
        <v-rating
          class="text-center"
          label="Rating"
          v-model="ratingField.value.value"
          length="5"
          half-increments
          clearable
          size="x-large"
          color="grey"
          active-color="orange"
          :error-messages="ratingField.errorMessage.value"
        />
        <v-spacer @click="ratingField.value.value = 5"></v-spacer>
      </v-row>

      <v-btn type="submit" color="primary" block class="mt-2">Submit</v-btn>
    </form>
  </v-card>
</template>

<script setup lang="ts">
import { useModal, useModalController } from '@/composables/modal';
import { BookContent } from '@/types/library';
import { onMounted } from 'vue';
import ImagePicker from '@/components/ImagePicker.vue';
import { computed } from 'vue';
import BarcodeScannerModal from './BarcodeScannerModal.vue';
import { useOpenBooks } from '@/composables/openBooks';
import { useToast } from 'vue-toast-notification';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const schema = yup.object({
  title: yup.string().required(),
  coverImageUrl: yup.string().nullable(),
  isbn: yup.string().max(13).nullable(),
  authors: yup.array().of(yup.string().required()),
  series: yup.string().nullable(),
  bookInSeries: yup.number().nullable(),
  tags: yup.array().of(yup.string().required()),
  rating: yup.number().min(0).max(5).nullable(),
  pageCount: yup
    .number()
    .transform(v => (Number.isNaN(v) ? null : v))
    .min(0)
    .integer()
    .nullable(),
});

const form = useForm<yup.InferType<typeof schema>>({
  validationSchema: schema,
});

const titleField = useField<string>('title');
const coverImageUrlField = useField<string>('coverImageUrl');
const isbnField = useField<string>('isbn');
const authorsField = useField<string[]>('authors');
const seriesField = useField<string>('series');
const bookInSeriesField = useField<number | undefined>('bookInSeries');
const tagsField = useField<string[]>('tags');
const ratingField = useField<number | undefined>('rating');
const pageCountField = useField<number | undefined>('pageCount');

const onSubmit = form.handleSubmit(() => {
  const resp: BookContent = {
    isbn: isbnField.value.value,
    title: titleField.value.value,
    authors: authorsField.value.value || [],
    coverImageUrl: coverImageUrlField.value.value,
    series: seriesField.value.value,
    pageCount: pageCountField.value.value,
    bookInSeries: bookInSeriesField.value.value,
    tags: tagsField.value.value,
    rating: ratingField.value.value,
  };

  // Enforce undefined as default for blank
  Object.entries(resp).forEach(([key, value]) => {
    (resp as any)[key] = value || undefined;
  });
  modal.close(resp);
});

// ----------------

const props = defineProps<{ content?: BookContent }>();

const modal = useModal();
const modalController = useModalController();
const { fetchBook } = useOpenBooks();
const toast = useToast();

const isEdit = computed(() => !!props.content);

onMounted(() => {
  const content = props.content;
  if (!content) {
    return;
  }

  titleField.value.value = content.title;
  coverImageUrlField.value.value = content.coverImageUrl || '';
  isbnField.value.value = content.isbn || '';
  authorsField.value.value = (content.authors || []).map(a => a);
  seriesField.value.value = content.series || '';
  bookInSeriesField.value.value = content.bookInSeries;
  tagsField.value.value = (content.tags || []).map(t => t);
  ratingField.value.value = content.rating;
  pageCountField.value.value = content.pageCount;
});

const onScan = async () => {
  try {
    const isbn = await modalController.show<string>({
      component: BarcodeScannerModal,
      options: { maxWidth: '500px' },
    });

    if (!isbn) {
      return;
    }

    modalController.showLoading({ message: 'Looking up your book now' });
    const book = await fetchBook(isbn);
    modalController.hideLoading();

    if (!book) {
      toast.error('Could not find anything on this book');
      return;
    }

    titleField.value.value = book.title || '';
    coverImageUrlField.value.value = book.coverImageUrl || '';
    isbnField.value.value = isbn;
    authorsField.value.value = book.authors;
    seriesField.value.value = book.series || '';

    toast.info('Book Updated!');
  } catch (error) {
    modalController.hideLoading();
  }
};
</script>
