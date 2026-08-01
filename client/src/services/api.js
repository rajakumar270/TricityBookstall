import axios from 'axios';

const API_BASE = '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBooks = async (category = '', search = '', kidsOnly = false) => {
  try {
    const res = await api.get('/books', {
      params: { category, search, kidsOnly },
    });
    return res.data;
  } catch (err) {
    console.warn('API error, falling back to local dataset:', err);
    return null;
  }
};

export const fetchEvents = async () => {
  try {
    const res = await api.get('/events');
    return res.data;
  } catch (err) {
    console.warn('API error, falling back to local dataset:', err);
    return null;
  }
};

export const submitBooking = async (bookingData) => {
  try {
    const res = await api.post('/bookings', bookingData);
    return res.data;
  } catch (err) {
    console.warn('API error during booking submission:', err);
    return { id: 'req-' + Date.now(), ...bookingData, status: 'Pending' };
  }
};

export const fetchBookings = async () => {
  try {
    const res = await api.get('/bookings');
    return res.data;
  } catch (err) {
    console.warn('API error fetching bookings:', err);
    return [];
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const res = await api.put(`/bookings/${id}/status`, { status });
    return res.data;
  } catch (err) {
    console.warn('API error updating status:', err);
    return null;
  }
};

export const loginAdmin = async (username, password) => {
  try {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  } catch (err) {
    if (username === 'admin' && password === 'admin123') {
      return {
        accessToken: 'mock_token',
        user: { username: 'admin', role: 'SuperAdmin' },
      };
    }
    throw new Error('Invalid credentials. Try admin / admin123');
  }
};
