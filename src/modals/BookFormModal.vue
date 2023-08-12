<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5"> {{ isEdit ? 'Edit' : 'Create' }} Book</v-card-title>
    <v-btn class="my-2" color="primary" block @click="onScan()"
      >Scan Barcode <v-icon>mdi-barcode</v-icon></v-btn
    >
    <v-form @submit.prevent="onSubmit">
      <v-text-field label="Title" v-model="form.title" :counter="255" required />
      <v-text-field label="ISBN" v-model="form.isbn" :counter="13" />
      <ImagePicker v-model="form.coverImageUrl" height="250" />
      <v-combobox label="Authors" v-model="form.authors" chips multiple clearable closable-chips />
      <v-combobox label="Tags" v-model="form.tags" chips multiple clearable closable-chips />
      <v-row class="ma-0">
        <v-spacer @click="form.rating = 0"></v-spacer>
        <v-rating
          class="text-center"
          label="Rating"
          v-model="form.rating"
          length="5"
          half-increments
          clearable
          size="x-large"
          color="grey"
          active-color="orange"
        />
        <v-spacer @click="form.rating = 5"></v-spacer>
      </v-row>

      <v-btn type="submit" color="primary" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';
import { BookContent } from '@/types/library';
import { onMounted, ref } from 'vue';
import ImagePicker from '@/components/ImagePicker.vue';
import { computed } from 'vue';

const props = defineProps<{ content?: BookContent }>();

const modal = useModal();

const isEdit = computed(() => !!props.content);

const form = ref<BookContent>({
  title: '',
  coverImageUrl: '',
  isbn: '',
  authors: [],
  series: undefined,
  bookInSeries: undefined,
  tags: [],
  rating: undefined,
});

onMounted(() => {
  const content = props.content;
  if (!content) {
    return;
  }

  const f = form.value;
  f.title = content.title;
  f.coverImageUrl = content.coverImageUrl;
  f.isbn = content.isbn;
  f.authors = content.authors?.map(a => a);
  f.series = content.series;
  f.bookInSeries = content.bookInSeries;
  f.tags = content.tags?.map(t => t);
  f.rating = content.rating;
});

const onSubmit = () => {
  modal.close({ ...form.value });
};

const onScan = () => {
  console.dir('--- on scan');
};
</script>
