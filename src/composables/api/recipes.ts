import { useInfiniteQuery } from '@tanstack/vue-query';
import { useHttp } from '../http';
import { Recipe } from '@/types/recipe';
import { Ref, computed } from 'vue';
import { PagedData } from '@/types/api';

const PAGE_SIZE = 5;

export const useRecipes = (searchText: Ref<string | undefined>) => {
  const { http } = useHttp();

  const state = useInfiniteQuery({
    queryKey: ['recipe', searchText],
    initialData: {
      pages: [] as PagedData<Recipe>[],
      pageParams: [],
    },
    queryFn: async data => {
      const query = {
        searchText: undefined,
        pageNumber: data.pageParam?.[0] || 0,
        pageSize: data.pageParam?.[1] || PAGE_SIZE,
      };
      return await http('recipes').query(query).get().json<PagedData<Recipe>>();
    },
    getNextPageParam: lastPage => {
      if (lastPage?.nextPage == null) {
        return;
      }

      return [lastPage.nextPage, lastPage.pageSize];
    },
  });

  const recipes = computed(() => {
    const pages = state.data.value?.pages || [];
    return pages.flatMap(d => d.data);
  });

  return { recipes, ...state };
};
