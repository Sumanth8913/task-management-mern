import api from './api';

export const taskService = {
  async list(params) {
    const res = await api.get('/tasks', { params });
    return { tasks: res.data.data.tasks, meta: res.data.meta };
  },
  async get(id) {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data.task;
  },
  async create(formData) {
    const res = await api.post('/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.task;
  },
  async update(id, formData) {
    const res = await api.patch(`/tasks/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.task;
  },
  async remove(id) {
    await api.delete(`/tasks/${id}`);
  },
  async weather(id) {
    const res = await api.get(`/tasks/${id}/weather`);
    return res.data.data.weather;
  },
};

// Builds a multipart FormData payload from a plain task object, skipping
// empty fields so PATCH requests don't overwrite values with blanks.
export const toTaskFormData = (task, file) => {
  const fd = new FormData();
  ['title', 'description', 'status', 'priority', 'dueDate', 'location'].forEach((key) => {
    if (task[key] !== undefined && task[key] !== null && task[key] !== '') {
      fd.append(key, task[key]);
    }
  });
  if (file) fd.append('attachment', file);
  return fd;
};
