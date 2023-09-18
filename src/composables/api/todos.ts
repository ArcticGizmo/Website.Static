import { useMutation, useQuery } from '@tanstack/vue-query';
import { useHttp } from '../http';
import { Todo } from '@/types/todo';
import { reactive } from 'vue';

export const useTodos = () => {
  const { http } = useHttp();

  const state = useQuery({
    queryKey: ['todos'],
    queryFn: () => http('todos').get().json<Todo[]>(),
  });

  return { todos: state.data, getTodos: reactive(state) };
};

export const useCreateTodo = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (text: string) => {
      return http('todos').post({ text }).res();
    },
  });

  return { createTodo: reactive(mutation) };
};

export const useUpdateTodo = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (req: { id: string; text: string }) => {
      return http(`todos/${req.id}`).put({ text: req.text }).res();
    },
  });

  return { updateTodo: reactive(mutation) };
};

export const useDeleteTodo = () => {
  const { http } = useHttp();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return http(`todos/${id}`).delete().res();
    },
  });

  return { deleteTodo: reactive(mutation) };
};
