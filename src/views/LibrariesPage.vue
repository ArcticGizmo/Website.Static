<template>
  <BasePage max-width="750px" :loading="getLibraries.isLoading">
    <h4 class="text-h4 pb-16">Check out your libraries!</h4>
    <v-row class="ma-0 pa-3">
      <v-spacer />
      <v-btn color="primary" icon="mdi-plus" @click="onCreateLibrary()" />
    </v-row>
    <v-list>
      <v-list-item
        class="ma-2"
        v-for="(library, index) in libraries"
        :key="index"
        border
        rounded
        @click="onSelectLibrary(library.id)"
      >
        {{ library.name }}
        <template v-slot:append>
          <v-btn
            color="grey-darken-1"
            icon="mdi-pencil"
            variant="text"
            @click.stop="onEdit(library)"
          />
          <!-- too scary to use at the moment with no backups enabled -->
          <!-- <v-btn
            color="grey-darken-1"
            icon="mdi-delete"
            variant="text"
            @click.stop="onDelete(library.id)"
          /> -->
        </template>
      </v-list-item>
    </v-list>
  </BasePage>
</template>

<script setup lang="ts">
import type { Library } from '@/types/library';
import router from '@/router';
import LibraryFormModal from '@/modals/LibraryFormModal.vue';
import { useModalController } from '@/composables/modal';
import { useDialog } from '@/composables/dialog';
import BasePage from './BasePage.vue';
import { useLibraries, useDeleteLibrary } from '@/composables/api/libraries';

const modalController = useModalController();
const dialogController = useDialog();

const { libraries, getLibraries } = useLibraries();
const { deleteLibrary } = useDeleteLibrary();

const onCreateLibrary = async () => {
  const resp = await modalController.show<'created'>({
    component: LibraryFormModal,
    options: { persistent: false, maxWidth: '750px' },
  });

  if (resp?.value === 'created') {
    getLibraries.refetch();
  }
};

const onEdit = async (library: Library) => {
  const result = await modalController.show<'updated'>({
    component: LibraryFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { id: library.id, library },
  });

  if (result?.value === 'updated') {
    await getLibraries.refetch();
  }
};

const onDelete = async (libraryId: string) => {
  const resp = await dialogController.confirmCancel({
    title: 'Delete Library',
    message: 'All books part of the library will be lost forever',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  if (resp !== 'confirm') {
    return;
  }

  await deleteLibrary.mutateAsync(libraryId);
  await getLibraries.refetch();
};

const onSelectLibrary = (libraryId: string) => {
  router.push({ name: 'Library', params: { libraryId } });
};
</script>

<style scoped></style>
