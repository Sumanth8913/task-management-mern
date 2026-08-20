import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { useTasksQuery, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';

const DEFAULT_FILTERS = { status: '', priority: '', startDate: '', endDate: '', sort: 'newest' };

export const TasksPage = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [modalTask, setModalTask] = useState(undefined); // undefined = closed, null = create, object = edit
  const [taskToDelete, setTaskToDelete] = useState(null);

  const queryParams = { page, limit: 9, search, ...filters };
  Object.keys(queryParams).forEach((k) => queryParams[k] === '' && delete queryParams[k]);

  const { data, isLoading, isError } = useTasksQuery(queryParams);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.tasks || [];
  const meta = data?.meta;

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };

  const handleSearchChange = (next) => {
    setSearch(next);
    setPage(1);
  };

  const handleSubmit = async ({ task, file }) => {
    if (modalTask) {
      await updateTask.mutateAsync({ id: modalTask._id, task, file });
    } else {
      await createTask.mutateAsync({ task, file });
    }
    setModalTask(undefined);
  };

  const handleMarkComplete = (task) => {
    updateTask.mutate({ id: task._id, task: { status: 'DONE' } });
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask.mutateAsync(taskToDelete._id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Tasks</h1>
        <button type="button" className="btn-primary" onClick={() => setModalTask(null)}>
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <div className="card space-y-4 p-4">
        <SearchBar value={search} onChange={handleSearchChange} />
        <FilterPanel filters={filters} onChange={handleFilterChange} />
      </div>

      {isLoading && <LoadingState label="Loading tasks..." />}

      {isError && <p className="text-sm text-red-600">We couldn't load your tasks. Please try again.</p>}

      {!isLoading && !isError && tasks.length === 0 && (
        <EmptyState
          action={
            <button type="button" className="btn-primary" onClick={() => setModalTask(null)}>
              <Plus className="h-4 w-4" /> Create task
            </button>
          }
        />
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setModalTask}
                onDelete={setTaskToDelete}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
          {meta && <Pagination {...meta} onPageChange={setPage} />}
        </>
      )}

      <TaskFormModal
        open={modalTask !== undefined}
        task={modalTask}
        onClose={() => setModalTask(undefined)}
        onSubmit={handleSubmit}
        isSubmitting={createTask.isPending || updateTask.isPending}
      />

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        description={`"${taskToDelete?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
