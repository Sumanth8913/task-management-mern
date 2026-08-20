export const FilterPanel = ({ filters, onChange }) => {
  const update = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <div>
        <label className="label" htmlFor="filter-status">Status</label>
        <select id="filter-status" className="input" value={filters.status} onChange={update('status')}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="filter-priority">Priority</label>
        <select id="filter-priority" className="input" value={filters.priority} onChange={update('priority')}>
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="filter-start">Due after</label>
        <input id="filter-start" type="date" className="input" value={filters.startDate} onChange={update('startDate')} />
      </div>
      <div>
        <label className="label" htmlFor="filter-end">Due before</label>
        <input id="filter-end" type="date" className="input" value={filters.endDate} onChange={update('endDate')} />
      </div>
      <div>
        <label className="label" htmlFor="filter-sort">Sort by</label>
        <select id="filter-sort" className="input" value={filters.sort} onChange={update('sort')}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="due_soon">Due soonest</option>
          <option value="due_late">Due latest</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};
