<template>
    <v-card class="text-center" min-width="200px" max-width="500px">
      <v-card-title>{{ title || 'Sort By' }}</v-card-title>
      <v-card-text class="pt-0">
        <v-list>
          <v-list-item
            v-for="(option, index) in options"
            :key="index"
            class="text-left"
            :active="value?.query === option.query"
            @click="modal.close(option)"
          >
            <template #append>
              <span class="font-italic"> ({{ option.ascending ? 'A-Z' : 'Z-A' }})</span>
            </template>
            {{ option.name }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/modal';
import type { SortField } from '@/types/api';

const modal = useModal();

defineProps<{ title?: string; value?: SortField; options: SortField[] }>();
</script>
