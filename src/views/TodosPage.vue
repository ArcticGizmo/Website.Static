<template>
  <BasePage>
    <h4 class="text-h4 pb-16">Check out your Todos!</h4>
    <v-row class="ma-0 pa-3">
      <v-spacer />
      <v-btn color="primary" icon="mdi-plus" @click="onCreateTodo()" />
    </v-row>
    <v-list>
      <v-list-item
        class="ma-2"
        v-for="(todo, index) in todos"
        :key="index"
        border
        rounded
        @click="onSelectTodo(todo.id)"
      >
        {{ todo.text }}
        <template v-slot:append>
          <v-btn
            color="grey-darken-1"
            icon="mdi-pencil"
            variant="text"
            @click.stop="onEdit(todo)"
          />
          <v-btn
            color="grey-darken-1"
            icon="mdi-delete"
            variant="text"
            @click.stop="onDelete(todo.id)"
          />
        </template>
      </v-list-item> </v-list
  ></BasePage>
</template>

<script setup lang="ts">
import type { Todo } from '@/types/todo';
import router from '@/router';
import TodoFormModal from '@/modals/TodoFormModal.vue';
import { useModalController } from '@/composables/modal';
import { useDialog } from '@/composables/dialog';
import BasePage from './BasePage.vue';
import { useTodos, useDeleteTodo } from '@/composables/api/todos';

const modalController = useModalController();
const dialogController = useDialog();

const { todos, getTodos } = useTodos();
const { deleteTodo } = useDeleteTodo();

const onCreateTodo = async () => {
  const resp = await modalController.show<'created'>({
    component: TodoFormModal,
    options: { persistent: false, maxWidth: '750px' },
  });

  if (resp?.value === 'created') {
    getTodos.refetch();
  }
};

const onEdit = async (todo: Todo) => {
  const result = await modalController.show<'updated'>({
    component: TodoFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { id: todo.id, todo },
  });

  if (result?.value === 'updated') {
    await getTodos.refetch();
  }
};

const onDelete = async (todoId: string) => {
  const resp = await dialogController.confirmCancel({
    title: 'Delete Todo',
    message: 'Are you sure you want to delete this todo?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmColor: 'error',
  });

  if (resp !== 'confirm') {
    return;
  }

  await deleteTodo.mutateAsync(todoId);
  await getTodos.refetch();
};

const onSelectTodo = (todoId: string) => {
  router.push({ name: 'Todo', params: { todoId } });
};
</script>
