import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
            <CheckSquare className="h-5 w-5 text-brand-500" aria-hidden="true" />
            <span>Task Manager</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 sm:flex"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            {user?.name}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary !px-3 !py-1.5 text-sm"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
