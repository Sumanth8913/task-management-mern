import { Calendar, MapPin, Paperclip } from 'lucide-react';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { WeatherBadge } from './WeatherBadge';

export const TaskDetails = ({ task }) => (
  <div className="card space-y-4 p-6">
    <div className="flex items-start justify-between gap-3">
      <h1 className="text-xl font-semibold text-slate-900">{task.title}</h1>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
        {task.status.replace('_', ' ')}
      </span>
    </div>

    {task.description && <p className="whitespace-pre-wrap text-sm text-slate-600">{task.description}</p>}

    <dl className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
      <div>
        <dt className="text-xs font-medium uppercase text-slate-400">Priority</dt>
        <dd className="mt-1 text-sm text-slate-700">{task.priority}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium uppercase text-slate-400">Due date</dt>
        <dd className="mt-1 flex items-center gap-1 text-sm text-slate-700">
          <Calendar className="h-4 w-4" aria-hidden="true" /> {formatDate(task.dueDate)}
        </dd>
      </div>
      {task.location && (
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Location</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {task.location}
            <WeatherBadge taskId={task._id} location={task.location} />
          </dd>
        </div>
      )}
      {task.completedAt && (
        <div>
          <dt className="text-xs font-medium uppercase text-slate-400">Completed</dt>
          <dd className="mt-1 text-sm text-slate-700">{formatDateTime(task.completedAt)}</dd>
        </div>
      )}
    </dl>

    {task.attachments?.length > 0 && (
      <div className="border-t border-slate-100 pt-4">
        <h2 className="text-xs font-medium uppercase text-slate-400">Attachments</h2>
        <ul className="mt-2 space-y-1">
          {task.attachments.map((a) => (
            <li key={a.publicId}>
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
              >
                <Paperclip className="h-3.5 w-3.5" aria-hidden="true" /> {a.originalName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
