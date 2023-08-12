<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5"> {{ isEdit ? 'Edit' : 'Create' }} Library</v-card-title>
    <v-form @submit.prevent="onSubmit">
      <v-text-field label="Title" v-model="form.name" :counter="255" required />
      <v-btn type="submit" color="primary" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';
import { Library } from '@/types/library';
import { computed } from 'vue';
import { onMounted, ref } from 'vue';

const props = defineProps<{ library?: Library }>();

const modal = useModal();

const form = ref<Library>({
  id: '',
  ownerUserId: '',
  name: '',
});

const isEdit = computed(() => !!props.library);

onMounted(() => {
  const lib = props.library;
  if (!lib) {
    return;
  }

  const f = form.value;
  f.id = lib.id;
  f.ownerUserId = lib.ownerUserId;
  f.name = lib.name;
});

const onSubmit = () => {
  modal.close({ ...form.value });
};
</script>
