import { taskService } from './taskService';

// Thin wrapper kept separate per the required project structure; weather is
// always fetched in the context of a task (server owns the API key).
export const weatherService = {
  forTask: (taskId) => taskService.weather(taskId),
};
