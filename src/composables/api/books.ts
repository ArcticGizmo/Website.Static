import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query';
import { useHttp } from '../http';
import { Book, BookContent } from '@/types/library';
import { MaybeRef, Ref, computed, reactive, unref } from 'vue';
import { PagedData } from '@/types/api';
import { debounce } from '@/util/debounce';

const PAGE_SIZE = 5;

export const useBooks = (libraryId: MaybeRef<string>, searchText: Ref<string | undefined>) => {
  const { http } = useHttp();

  const state = useInfiniteQuery({
    queryKey: ['books', libraryId, searchText],

    queryFn: async data => {
      const query = {
        searchText: undefined,
        pageNumber: data.pageParam?.[0] || 0,
        pageSize: data.pageParam?.[1] || PAGE_SIZE,
      };
      return await http(`libraries/${unref(libraryId)}/books`)
        .query(query)
        .get()
        .json<PagedData<Book>>();
    },
    getNextPageParam: lastPage => {
      if (lastPage?.nextPage == null) {
        return;
      }

      return [lastPage.nextPage, lastPage.pageSize];
    },
  });

  const fetchNextPageDebounced = debounce(state.fetchNextPage, 500);

  const refetchDebounced = debounce(state.refetch, 500);

  const books = computed(() => {
    const pages = state.data.value?.pages || [];
    return pages.flatMap(d => d.data);
  });

  return { books, getBooks: reactive({ fetchNextPageDebounced, refetchDebounced, ...state }) };
};

export const useBook = (id: MaybeRef<string>) => {
  const { http } = useHttp();

  const state = useQuery({
    queryKey: ['book', id],
    queryFn: () => http('books/').get(unref(id)).json<Book>(),
  });

  return { book: state.data, getBook: reactive(state) };
};

export const useCreateBook = (libraryId: MaybeRef<string>) => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (content: BookContent) => {
      return http('books')
        .post({ libraryId: unref(libraryId), content })
        .res();
    },
  });

  return { createBook: mutation };
};

export const useUpdateBook = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (req: { id: string; content: BookContent }) => {
      return http(`books/${req.id}`).put(req.content).res();
    },
  });

  return { updateBook: mutation };
};

export const useDeleteBook = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return http(`books/${id}`).delete().res();
    },
  });

  return { deleteBook: mutation };
};

export const useAlreadyExists = () => {
  const { http } = useHttp();

  const alreadyExists = async (libraryId?: string, isbn?: string) => {
    if (!libraryId || !isbn) {
      return false;
    }
    return http(`libraries/${libraryId}/book-exists/${isbn}`).get().json<boolean>();
  };

  return { alreadyExists };
};
