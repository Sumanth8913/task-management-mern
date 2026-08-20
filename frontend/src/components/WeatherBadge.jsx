import { useQuery } from '@tanstack/react-query';
import { CloudOff, Loader2, MapPin } from 'lucide-react';
import { weatherService } from '../services/weatherService';

// Weather is fetched only when a task has a location, and only lazily
// (enabled: Boolean(location)) so we never hit the API for location-less tasks.
export const WeatherBadge = ({ taskId, location }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['weather', taskId],
    queryFn: () => weatherService.forTask(taskId),
    enabled: Boolean(location),
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

  if (!location) return null;

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Weather...
      </span>
    );
  }

  if (isError || !data) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <CloudOff className="h-3 w-3" /> Weather unavailable
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-600" title={data.cityName}>
      <MapPin className="h-3 w-3" aria-hidden="true" />
      {data.temperature}°C · {data.description}
    </span>
  );
};
