const fetch = require('node-fetch');

// Very small in-memory TTL cache to avoid hammering OpenWeatherMap for the
// same city repeatedly (weather doesn't change second-to-second).
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache = new Map();

const isWeatherConfigured = () => Boolean(process.env.OPENWEATHER_API_KEY);

const getWeatherForCity = async (city) => {
  if (!city || !city.trim()) {
    const err = new Error('No location provided for this task.');
    err.statusCode = 400;
    throw err;
  }

  if (!isWeatherConfigured()) {
    const err = new Error('Weather integration is not configured.');
    err.statusCode = 503;
    throw err;
  }

  const key = city.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    const e = new Error('Weather service timed out or is unreachable.');
    e.statusCode = 504;
    throw e;
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 404) {
    const err = new Error(`Could not find weather for "${city}".`);
    err.statusCode = 404;
    throw err;
  }
  if (!response.ok) {
    const err = new Error('Weather provider returned an error.');
    err.statusCode = 502;
    throw err;
  }

  const raw = await response.json();
  const normalized = {
    temperature: Math.round(raw.main?.temp),
    description: raw.weather?.[0]?.description || 'Unknown',
    icon: raw.weather?.[0]?.icon || null,
    cityName: raw.name || city,
  };

  cache.set(key, { data: normalized, timestamp: Date.now() });
  return normalized;
};

module.exports = { getWeatherForCity, isWeatherConfigured };
