<template>
  <v-card class="book-card" border rounded elevation="4">
    <v-row class="ma-0 fill-height">
      <v-col cols="3" class="pa-2">
        <ImageWithPlaceholder
          class="bg-white fill-height"
          :class="{ wishlist: book.content.wishlist }"
          contain
          :src="book.content.coverImageUrl"
          fallback-icon="mdi-book"
        />
        <div class="icons text-left" @click.stop>
          <v-tooltip v-if="book.content.wishlist" location="top">
            <template #activator="{ props }">
              <v-icon size="small" v-bind="props">mdi-tag-heart-outline</v-icon>
            </template>
            Wishlist
          </v-tooltip>

          <v-tooltip v-if="book.content.read" location="top">
            <template #activator="{ props }">
              <v-icon size="small" v-bind="props">mdi-check</v-icon>
            </template>
            Read
          </v-tooltip>
        </div>
      </v-col>
      <v-col class="text-left">
        <h2>{{ book.content.title }}</h2>
        <p class="series" v-if="seriesText">{{ seriesText }}</p>
        <p class="authors pb-2" v-if="book.content.authors">
          {{ book.content.authors.join(', ') }}
        </p>
        <div class="tags py-1">
          <v-chip
            v-for="(tag, index) in book.content.tags || []"
            color="blue"
            size="small"
            :key="index"
          >
            {{ tag }}
          </v-chip>
        </div>
        <v-rating
          density="compact"
          size="small"
          :length="5"
          half-increments
          :model-value="book.content.rating"
          readonly
          active-color="orange"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { Book } from '@/types/library';
import { computed } from 'vue';
import ImageWithPlaceholder from '@/components/ImageWithPlaceholder.vue';

const props = defineProps<{ book: Book }>();

const seriesText = computed(() => {
  const { series, bookInSeries } = props.book.content;
  if (!series) {
    return '';
  }

  if (!bookInSeries) {
    return series;
  }

  return `${series} #${bookInSeries}`;
});
</script>

<style scoped>
.book-card {
  min-height: 10rem;
  user-select: none;
}
.series {
  font-style: italic;
  color: dimgray;
}

.v-img .v-icon {
  font-size: 3rem;
  height: 100%;
}

.v-img__error {
  border: 1px solid gray;
}

.icons {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  background-color: rgba(255, 255, 255, 0.637);
}

.wishlist {
  opacity: 0.5;
}
</style>
