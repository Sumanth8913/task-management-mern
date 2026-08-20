import { ClipboardList } from 'lucide-react';

export const EmptyState = ({
  title = 'No tasks yet',
  description = 'Create your first task to get started.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
    <ClipboardList className="h-8 w-8 text-slate-400" aria-hidden="true" />
    <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
    <p className="max-w-xs text-sm text-slate-500">{description}</p>
    {action}
  </div>
);
