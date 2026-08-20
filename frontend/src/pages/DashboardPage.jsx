import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasksQuery } from '../hooks/useTasks';
import { LoadingState } from '../components/LoadingState';
import { formatDate } from '../utils/formatDate';

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <div className="card flex items-center gap-4 p-4">
    <div className={`rounded-lg p-2.5 ${tone}`}>
      <Icon className="h-5 w-5" aria-hidden="true" />
    </div>
    <div>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

export const DashboardPage = () => {
  const { user } = useAuth();
  // A generous page size gives the dashboard enough data to compute real
  // aggregate stats and an upcoming-deadlines list without a separate stats endpoint.
  const { data, isLoading, isError } = useTasksQuery({ page: 1, limit: 50, sort: 'due_soon' });

  const tasks = data?.tasks || [];
  const total = data?.meta?.total ?? tasks.length;

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'PENDING').length;
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter((t) => t.status === 'DONE').length;
    const highPriority = tasks.filter((t) => t.priority === 'HIGH' && t.status !== 'DONE').length;
    return { pending, inProgress, done, highPriority };
  }, [tasks]);

  const upcoming = useMemo(
    () => tasks.filter((t) => t.dueDate && t.status !== 'DONE').slice(0, 5),
    [tasks]
  );

  if (isLoading) return <LoadingState label="Loading your dashboard..." />;

  if (isError) {
    return <p className="text-sm text-red-600">We couldn't load your dashboard. Please try again.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500">Here's what's happening with your tasks.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total" value={total} icon={Circle} tone="bg-slate-100 text-slate-600" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="bg-slate-100 text-slate-600" />
        <StatCard label="In progress" value={stats.inProgress} icon={Clock} tone="bg-amber-100 text-amber-700" />
        <StatCard label="Completed" value={stats.done} icon={CheckCircle2} tone="bg-emerald-100 text-emerald-700" />
        <StatCard label="High priority" value={stats.highPriority} icon={AlertTriangle} tone="bg-red-100 text-red-700" />
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Upcoming deadlines</h2>
          <Link to="/tasks" className="text-sm text-brand-600 hover:underline">View all tasks</Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming deadlines. You're all caught up.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {upcoming.map((task) => (
              <li key={task._id} className="flex items-center justify-between py-2">
                <Link to={`/tasks/${task._id}`} className="text-sm text-slate-700 hover:text-brand-600">
                  {task.title}
                </Link>
                <span className="text-xs text-slate-500">{formatDate(task.dueDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
