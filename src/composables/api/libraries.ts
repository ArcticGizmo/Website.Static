import { useMutation, useQuery } from '@tanstack/vue-query';
import { useHttp } from '../http';
import { Library } from '@/types/library';
import { MaybeRef, reactive, unref } from 'vue';
import { debounce } from '@/util/debounce';

export const useLibraries = () => {
  const { http } = useHttp();

  const state = useQuery({
    queryKey: ['libraries'],
    queryFn: () => http('libraries').get().json<Library[]>(),
  });

  return { libraries: state.data, getLibraries: reactive(state) };
};

export const useLibrary = (id: MaybeRef<string>) => {
  const { http } = useHttp();

  const state = useQuery({
    queryKey: ['libraries', id],
    queryFn: () => http('libraries/').get(unref(id)).json<Library>(),
  });

  const refetchDebounced = debounce(state.refetch, 500);

  return { library: state.data, getLibrary: reactive({ ...state, refetchDebounced }) };
};

export const useCreateLibrary = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (req: Library) => {
      return http('libraries').post(req).res();
    },
  });

  return { createLibrary: reactive(mutation) };
};

export const useUpdateLibrary = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (req: { id: string; content: Library }) => {
      return http(`libraries/${req.id}`).put(req.content).res();
    },
  });

  return { updateLibrary: reactive(mutation) };
};

export const useDeleteLibrary = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return http(`libraries/${id}`).delete().res();
    },
  });

  return { deleteLibrary: reactive(mutation) };
};
