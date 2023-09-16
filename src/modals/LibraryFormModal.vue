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
import { useModal, useModalController } from '@/composables/modal';
import { Library } from '@/types/library';
import { computed } from 'vue';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useCreateLibrary, useUpdateLibrary } from '@/composables/api/libraries';

const props = defineProps<{ id?: string; library?: Library }>();

const modal = useModal();
const toast = useToast();
const modalController = useModalController();

const { createLibrary } = useCreateLibrary();
const { updateLibrary } = useUpdateLibrary();

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

const onSubmit = async () => {
  const req: Library = {
    id: props.id || '',
    ownerUserId: form.value.ownerUserId,
    name: form.value.name,
  };
  if (props.id) {
    modalController.showLoading({ title: 'Creating Library' });
    await submitUpdate(req);
  } else {
    modalController.showLoading({ title: 'Updating Library' });
    await submitCreate(req);
  }

  modalController.hideLoading();
};

const submitUpdate = async (content: Library) => {
  await updateLibrary.mutateAsync(
    { id: props.id!, content },
    {
      onSuccess: () => {
        toast.success('Library Updated')!;
        modal.close('updated');
      },
      onError: () => {
        toast.error('Unable to update library at this time', { duration: 3000 });
      },
    },
  );
};

const submitCreate = async (content: Library) => {
  await createLibrary.mutateAsync(content, {
    onSuccess: () => {
      toast.success('Library Created')!;
      modal.close('created');
    },
    onError: () => {
      toast.error('Unable to create library at this time', { duration: 3000 });
    },
  });
};
</script>
