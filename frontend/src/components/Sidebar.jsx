import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, User, X } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/profile', label: 'Profile', icon: User },
];

export const Sidebar = ({ open, onClose }) => {
  const content = (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Primary">
      <div className="mb-2 flex items-center justify-between md:hidden">
        <span className="text-sm font-semibold text-slate-900">Menu</span>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">{content}</aside>
        </div>
      )}
    </>
  );
};
