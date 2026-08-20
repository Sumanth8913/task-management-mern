import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

// Debounces user input before propagating to the parent so we don't fire an
// API request on every keystroke.
export const SearchBar = ({ value, onChange, placeholder = 'Search tasks...' }) => {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        type="search"
        className="input pl-9"
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        aria-label="Search tasks"
      />
    </div>
  );
};
