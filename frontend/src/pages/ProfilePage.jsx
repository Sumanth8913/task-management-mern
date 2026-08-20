import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/formatDate';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
      <div className="card space-y-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Name</p>
          <p className="mt-1 text-sm text-slate-700">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Email</p>
          <p className="mt-1 text-sm text-slate-700">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">Member since</p>
          <p className="mt-1 text-sm text-slate-700">{formatDate(user?.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};
