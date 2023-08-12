<template>
  <v-container class="fill-height">
    <v-responsive class="text-center fill-height">
      <h4 class="text-h4 pb-16">Check out your libraries!</h4>

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

      <v-btn size="x-large" color="primary" @click="onCreateLibrary()">Create Library</v-btn>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { useHttp } from '@/composables/http';
import { ref, onMounted } from 'vue';
import type { Library } from '@/types/library';
import router from '@/router';

const { http } = useHttp();

const libraries = ref<Library[]>([]);

onMounted(() => {
  fetchLibraries();
});

const fetchLibraries = async () => {
  libraries.value = await http('library').get().json<Library[]>();
};

const onCreateLibrary = async () => {
  await http('library').post({ name: 'Library C' }).res();
  await fetchLibraries();
};

const onEdit = (library: Library) => {};
const onDelete = async (libraryId: string) => {
  await http(`library/${libraryId}`).delete().res();
  await fetchLibraries();
};

const onSelectLibrary = (libraryId: string) => {
  router.push({ name: 'Library', params: { libraryId } });
};
</script>

<style scoped></style>
