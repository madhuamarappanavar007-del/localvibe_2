const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Request failed: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Check that the server is running and configured correctly.');
    }
    throw error;
  }
}

export const api = {
  getCategories: () => request('/events/categories'),
  getEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events${qs ? `?${qs}` : ''}`);
  },
  getNearbyEvents: (lat, lng, params = {}) => {
    const qs = new URLSearchParams({ lat, lng, ...params }).toString();
    return request(`/events/nearby?${qs}`);
  },
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  rsvp: (eventId, userId, status) =>
    request(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ userId, status }),
    }),
  friendsGoing: (eventId, userId) =>
    request(`/events/${eventId}/friends-going?userId=${userId}`),
  getRecommendations: (userId, lat, lng) => {
    const qs = new URLSearchParams({ lat, lng }).toString();
    return request(`/events/recommendations/${userId}?${qs}`);
  },
  geocode: (q) => request(`/geocode?q=${encodeURIComponent(q)}`),
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  followUser: (userId, targetId) =>
    request(`/users/${userId}/follow/${targetId}`, { method: 'POST' }),
  getUserEvents: (userId) => request(`/users/${userId}/events`),
};
