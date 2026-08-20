import { useEffect, useState } from 'react';
import { X, Paperclip } from 'lucide-react';
import { toInputDate } from '../utils/formatDate';
import { validateTaskForm } from '../utils/validation';

const EMPTY_TASK = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  dueDate: '',
  location: '',
};

export const TaskFormModal = ({ open, task, onClose, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState(EMPTY_TASK);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'PENDING',
        priority: task.priority || 'MEDIUM',
        dueDate: toInputDate(task.dueDate),
        location: task.location || '',
      });
    } else {
      setForm(EMPTY_TASK);
    }
    setFile(null);
    setErrors({});
  }, [task, open]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTaskForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ task: form, file });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">{task ? 'Edit task' : 'Create task'}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="task-title">Title</label>
            <input id="task-title" className="input" value={form.title} onChange={handleChange('title')} required />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="label" htmlFor="task-description">Description</label>
            <textarea id="task-description" className="input" rows={3} value={form.description} onChange={handleChange('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="task-status">Status</label>
              <select id="task-status" className="input" value={form.status} onChange={handleChange('status')}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" className="input" value={form.priority} onChange={handleChange('priority')}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="task-due">Due date</label>
              <input id="task-due" type="date" className="input" value={form.dueDate} onChange={handleChange('dueDate')} />
            </div>
            <div>
              <label className="label" htmlFor="task-location">Location</label>
              <input id="task-location" className="input" placeholder="City" value={form.location} onChange={handleChange('location')} />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="task-attachment">Attachment</label>
            <label htmlFor="task-attachment" className="btn-secondary w-full cursor-pointer justify-start text-sm text-slate-500">
              <Paperclip className="h-4 w-4" />
              {file ? file.name : 'Choose a file (JPG, PNG, PDF, DOC)'}
            </label>
            <input
              id="task-attachment"
              type="file"
              className="sr-only"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
