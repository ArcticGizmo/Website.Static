<template>
  <v-container class="fill-height justify-center">
    <v-responsive class="text-center fill-height" max-width="750px">
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
            <v-btn
              color="grey-darken-1"
              icon="mdi-delete"
              variant="text"
              @click.stop="onDelete(library.id)"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useHttp } from '@/composables/http';
import { ref, onMounted } from 'vue';
import type { Library } from '@/types/library';
import router from '@/router';
import LibraryFormModal from '@/modals/LibraryFormModal.vue';
import { useModalController } from '@/composables/modal';
import { useDialog } from '@/composables/dialog';

const { http } = useHttp();

const libraries = ref<Library[]>([]);
const modalController = useModalController();
const dialogController = useDialog();

onMounted(() => {
  fetchLibraries();
});

const fetchLibraries = async () => {
  libraries.value = await http('library').get().json<Library[]>();
};

const onCreateLibrary = async () => {
  const lib = await modalController.show<Library>({
    component: LibraryFormModal,
    options: { persistent: false, maxWidth: '750px' },
  });

  if (!lib) {
    return;
  }

  await http('library').post(lib).res();
  await fetchLibraries();
};

const onEdit = async (library: Library) => {
  const updatedLib = await modalController.show<Library>({
    component: LibraryFormModal,
    options: { persistent: false, maxWidth: '750px' },
    props: { library },
  });

  if (!updatedLib) {
    return;
  }

  await http(`library/${library.id}`).put(updatedLib).res();
  await fetchLibraries();
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

  await http(`library/${libraryId}`).delete().res();
  await fetchLibraries();
};

const onSelectLibrary = (libraryId: string) => {
  router.push({ name: 'Library', params: { libraryId } });
};
</script>

<style scoped></style>
