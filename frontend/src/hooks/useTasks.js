import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService, toTaskFormData } from '../services/taskService';

export const taskKeys = {
  all: ['tasks'],
  list: (params) => ['tasks', 'list', params],
  detail: (id) => ['tasks', 'detail', id],
};

export const useTasksQuery = (params) =>
  useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => taskService.list(params),
    keepPreviousData: true,
  });

export const useTaskQuery = (id) =>
  useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskService.get(id),
    enabled: Boolean(id),
  });

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ task, file }) => taskService.create(toTaskFormData(task, file)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, task, file }) => taskService.update(id, toTaskFormData(task, file)),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.setQueryData(taskKeys.detail(updatedTask._id), updatedTask);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => taskService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
};
