import { Link } from 'react-router-dom';
import { Calendar, MapPin, Paperclip, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/formatDate';
import { WeatherBadge } from './WeatherBadge';

const STATUS_STYLES = {
  PENDING: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  DONE: 'bg-emerald-100 text-emerald-800',
};

const PRIORITY_STYLES = {
  LOW: 'bg-sky-50 text-sky-700 border-sky-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH: 'bg-red-50 text-red-700 border-red-200',
};

export const TaskCard = ({ task, onEdit, onDelete, onMarkComplete }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/tasks/${task._id}`} className="font-semibold text-slate-900 hover:text-brand-600">
          {task.title}
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {task.description && (
        <p className="line-clamp-2 text-sm text-slate-500">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`inline-flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
          <Calendar className="h-3 w-3" aria-hidden="true" />
          {formatDate(task.dueDate)} {overdue && '(overdue)'}
        </span>
        {task.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {task.location}
          </span>
        )}
        {task.attachments?.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3 w-3" aria-hidden="true" />
            {task.attachments.length}
          </span>
        )}
        <WeatherBadge taskId={task._id} location={task.location} />
      </div>

      <div className="mt-1 flex items-center gap-2 border-t border-slate-100 pt-3">
        {task.status !== 'DONE' && (
          <button type="button" className="btn-secondary !px-2.5 !py-1 text-xs" onClick={() => onMarkComplete(task)}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark done
          </button>
        )}
        <button type="button" className="btn-secondary !px-2.5 !py-1 text-xs" onClick={() => onEdit(task)}>
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button type="button" className="btn-secondary !px-2.5 !py-1 text-xs text-red-600" onClick={() => onDelete(task)}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
};
