import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
    <h1 className="text-4xl font-bold text-slate-900">404</h1>
    <p className="text-sm text-slate-500">This page doesn't exist.</p>
    <Link to="/dashboard" className="btn-primary">Go to dashboard</Link>
  </div>
);
