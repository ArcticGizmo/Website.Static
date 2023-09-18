<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5"> {{ isEdit ? 'Edit' : 'Create' }} Todo</v-card-title>
    <v-form @submit.prevent="onSubmit">
      <v-textarea label="Todo" v-model="form.text" :counter="255" required auto-grow />
      <v-btn type="submit" color="primary" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useModal, useModalController } from '@/composables/modal';
import { Todo } from '@/types/todo';
import { computed } from 'vue';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useCreateTodo, useUpdateTodo } from '@/composables/api/todos';

const props = defineProps<{ id?: string; todo?: Todo }>();

const modal = useModal();
const toast = useToast();
const modalController = useModalController();

const { createTodo } = useCreateTodo();
const { updateTodo } = useUpdateTodo();

const form = ref<Todo>({
  id: '',
  text: '',
});

const isEdit = computed(() => !!props.todo);

onMounted(() => {
  const lib = props.todo;
  if (!lib) {
    return;
  }

  const f = form.value;
  f.id = lib.id;
  f.text = lib.text;
});

const onSubmit = async () => {
  const req: Todo = {
    id: props.id || '',
    text: form.value.text,
  };
  if (props.id) {
    modalController.showLoading({ title: 'Creating Todo' });
    await submitUpdate(req);
  } else {
    modalController.showLoading({ title: 'Updating Todo' });
    await submitCreate(req);
  }

  modalController.hideLoading();
};

const submitUpdate = async (content: Todo) => {
  await updateTodo.mutateAsync(
    { id: props.id!, text: content.text },
    {
      onSuccess: () => {
        toast.success('Todo Updated')!;
        modal.close('updated');
      },
      onError: () => {
        toast.error('Unable to update todo at this time', { duration: 3000 });
      },
    },
  );
};

const submitCreate = async (content: Todo) => {
  await createTodo.mutateAsync(content.text, {
    onSuccess: () => {
      toast.success('Todo Created')!;
      modal.close('created');
    },
    onError: () => {
      toast.error('Unable to create todo at this time', { duration: 3000 });
    },
  });
};
</script>
