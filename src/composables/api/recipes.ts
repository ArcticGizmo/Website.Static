import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query';
import { useHttp } from '../http';
import { Recipe, RecipeContent } from '@/types/recipe';
import { MaybeRef, Ref, computed, unref } from 'vue';
import { PagedData } from '@/types/api';
import { debounce } from '@/util/debounce';

const PAGE_SIZE = 5;

export const useRecipes = (searchText: Ref<string | undefined>) => {
  const { http } = useHttp();

  const state = useInfiniteQuery({
    queryKey: ['recipe', searchText],

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

  const fetchNextPageDebounced = debounce(state.fetchNextPage, 500);

  const recipes = computed(() => {
    const pages = state.data.value?.pages || [];
    return pages.flatMap(d => d.data);
  });

  return { recipes, fetchNextPageDebounced, ...state };
};

export const useRecipe = (id: MaybeRef<string>) => {
  const { http } = useHttp();

  const state = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => http('recipes/').get(unref(id)).json<Recipe>(),
  });

  return { recipe: state.data, getRecipe: state };
};

export const useCreateRecipe = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (content: RecipeContent) => {
      return http('recipes').post(content).res();
    },
  });

  return { createRecipe: mutation };
};

export const useUpdateRecipe = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (req: { id: string; content: RecipeContent }) => {
      return http(`recipes/${req.id}`).put(req.content).res();
    },
  });

  return { updateRecipe: mutation };
};

export const useDeleteRecipe = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return http(`recipes/${id}`).delete().res();
    },
  });

  return { deleteRecipe: mutation };
};
