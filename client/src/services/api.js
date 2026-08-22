import axios from 'axios';

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  return '/api';
};

export const api = axios.create({
  baseURL: getApiBase(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// ───── Settings ─────
export const fetchSettingsApi = async () => {
  try { const res = await api.get('/settings'); return res.data; }
  catch (err) { console.warn('API error fetching settings:', err); return null; }
};
export const updateSettingsApi = async (settingsData) => {
  try { const res = await api.put('/settings', settingsData); return res.data; }
  catch (err) { console.warn('API error updating settings:', err); return null; }
};

// ───── Books ─────
export const fetchBooks = async (mainCategory = '', category = '', search = '', kidsOnly = false) => {
  try { const res = await api.get('/books', { params: { mainCategory, category, search, kidsOnly } }); return res.data; }
  catch (err) { console.warn('API error fetching books:', err); return null; }
};
export const createBookApi = async (bookData) => {
  try { const res = await api.post('/books', bookData); return res.data; }
  catch (err) { console.warn('API error creating book:', err); return { id: 'b_' + Date.now(), ...bookData }; }
};
export const updateBookApi = async (id, bookData) => {
  try { const res = await api.put(`/books/${id}`, bookData); return res.data; }
  catch (err) { console.warn('API error updating book:', err); return { id, ...bookData }; }
};
export const deleteBookApi = async (id) => {
  try { const res = await api.delete(`/books/${id}`); return res.data; }
  catch (err) { console.warn('API error deleting book:', err); return { success: true }; }
};

// ───── Sales ─────
export const recordSalesEntryApi = async (salesData) => {
  try { const res = await api.post('/books/sales-entry', salesData); return res.data; }
  catch (err) {
    console.warn('API error recording sales entry:', err);
    return { id: 'sale_' + Date.now(), ...salesData, totalAmount: (Number(salesData.quantitySold) || 0) * (Number(salesData.sellingPriceOnDate) || 0), createdAt: new Date().toISOString() };
  }
};
export const fetchSalesLogsApi = async () => {
  try { const res = await api.get('/books/sales-logs'); return res.data; }
  catch (err) { console.warn('API error fetching sales logs:', err); return []; }
};

// ───── Events ─────
export const fetchEvents = async () => {
  try { const res = await api.get('/events'); return res.data; }
  catch (err) { console.warn('API error fetching events:', err); return []; }
};
export const createEventApi = async (eventData) => {
  try { const res = await api.post('/events', eventData); return res.data; }
  catch (err) { console.warn('API error creating event:', err); return null; }
};
export const updateEventApi = async (id, eventData) => {
  try { const res = await api.put(`/events/${id}`, eventData); return res.data; }
  catch (err) { console.warn('API error updating event:', err); return null; }
};
export const deleteEventApi = async (id) => {
  try { const res = await api.delete(`/events/${id}`); return res.data; }
  catch (err) { console.warn('API error deleting event:', err); return null; }
};

// ───── Gallery ─────
export const fetchGalleryApi = async () => {
  try { const res = await api.get('/gallery'); return res.data; }
  catch (err) { console.warn('API error fetching gallery:', err); return []; }
};
export const createGalleryApi = async (data) => {
  try { const res = await api.post('/gallery', data); return res.data; }
  catch (err) { console.warn('API error creating gallery:', err); return null; }
};
export const updateGalleryApi = async (id, data) => {
  try { const res = await api.put(`/gallery/${id}`, data); return res.data; }
  catch (err) { console.warn('API error updating gallery:', err); return null; }
};
export const deleteGalleryApi = async (id) => {
  try { const res = await api.delete(`/gallery/${id}`); return res.data; }
  catch (err) { console.warn('API error deleting gallery:', err); return null; }
};

// ───── CMS Content Blocks ─────
export const fetchCmsBlocksApi = async () => {
  try { const res = await api.get('/cms'); return res.data; }
  catch (err) { console.warn('API error fetching CMS blocks:', err); return null; }
};
export const updateCmsBlockApi = async (key, content) => {
  try { const res = await api.put(`/cms/${key}`, content); return res.data; }
  catch (err) { console.warn('API error updating CMS block:', err); return null; }
};

// ───── Bookings ─────
export const submitBooking = async (bookingData) => {
  try { const res = await api.post('/bookings', bookingData); return res.data; }
  catch (err) { console.warn('API error during booking submission:', err); return { id: 'req-' + Date.now(), ...bookingData, status: 'Pending' }; }
};
export const fetchBookings = async () => {
  try { const res = await api.get('/bookings'); return res.data; }
  catch (err) { console.warn('API error fetching bookings:', err); return []; }
};
export const updateBookingStatus = async (id, status) => {
  try { const res = await api.put(`/bookings/${id}/status`, { status }); return res.data; }
  catch (err) { console.warn('API error updating status:', err); return null; }
};

// ───── Auth & Users ─────
export const loginAdmin = async (username, password) => {
  try { const res = await api.post('/auth/login', { username, password }); return res.data; }
  catch (err) { throw new Error('Invalid credentials. Please check your username and password.'); }
};
export const fetchUsersApi = async () => {
  try { const res = await api.get('/auth/users'); return res.data; }
  catch (err) { console.warn('API error fetching users:', err); return []; }
};
export const createUserApi = async (data) => {
  try { const res = await api.post('/auth/users', data); return res.data; }
  catch (err) { console.warn('API error creating user:', err); throw err; }
};
export const updateUserApi = async (id, data) => {
  try { const res = await api.put(`/auth/users/${id}`, data); return res.data; }
  catch (err) { console.warn('API error updating user:', err); return null; }
};
export const deleteUserApi = async (id) => {
  try { const res = await api.delete(`/auth/users/${id}`); return res.data; }
  catch (err) { console.warn('API error deleting user:', err); return null; }
};

// ───── Media & Assets Management ─────
export const fetchMediaAssetsApi = async () => {
  try { const res = await api.get('/media'); return res.data; }
  catch (err) { console.warn('API error fetching media assets:', err); return []; }
};
export const uploadMediaAssetApi = async (filename, base64Data) => {
  try { const res = await api.post('/media/upload', { filename, data: base64Data }); return res.data; }
  catch (err) { console.warn('API error uploading asset:', err); throw err; }
};
export const renameMediaAssetApi = async (oldName, newName, updateReferences = true) => {
  try { const res = await api.put('/media/rename', { oldName, newName, updateReferences }); return res.data; }
  catch (err) { console.warn('API error renaming asset:', err); throw err; }
};
export const deleteMediaAssetApi = async (filename, force = false) => {
  try { const res = await api.delete(`/media/${encodeURIComponent(filename)}`, { params: { force: force ? 'true' : 'false' } }); return res.data; }
  catch (err) { console.warn('API error deleting asset:', err); throw err; }
};
export const checkMediaUsageApi = async (filename) => {
  try { const res = await api.get(`/media/usage/${encodeURIComponent(filename)}`); return res.data; }
  catch (err) { console.warn('API error checking usage:', err); return { filename, usedIn: [], usageCount: 0 }; }
};

