import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useTaskQuery, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { LoadingState } from '../components/LoadingState';
import { TaskDetails } from '../components/TaskDetails';
import { TaskFormModal } from '../components/TaskFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: task, isLoading, isError } = useTaskQuery(id);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (isLoading) return <LoadingState label="Loading task..." />;
  if (isError || !task) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">We couldn't load this task.</p>
        <Link to="/tasks" className="text-sm text-brand-600 hover:underline">Back to tasks</Link>
      </div>
    );
  }

  const handleSubmit = async ({ task: updates, file }) => {
    await updateTask.mutateAsync({ id: task._id, task: updates, file });
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync(task._id);
    navigate('/tasks');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => navigate('/tasks')} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to tasks
        </button>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button type="button" className="btn-danger" onClick={() => setConfirmingDelete(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <TaskDetails task={task} />

      <TaskFormModal
        open={editing}
        task={task}
        onClose={() => setEditing(false)}
        onSubmit={handleSubmit}
        isSubmitting={updateTask.isPending}
      />

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this task?"
        description={`"${task.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
};
