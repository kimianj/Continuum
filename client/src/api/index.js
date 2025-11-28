<<<<<<< HEAD
// Use relative URL - works in both dev (via Vite proxy) and production
=======
>>>>>>> d7821fe0dab4b1de5da1338632f5a699f14e42e2
const API_BASE = '/api';

// Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

// Auth API
export const authApi = {
  signup: async (email, password, name) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Notes API
export const notesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/notes`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getOne: async (id) => {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (title, content) => {
    const response = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content })
    });
    return handleResponse(response);
  },

  update: async (id, title, content) => {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ title, content })
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Admin API
export const adminApi = {
  getAllNotes: async () => {
    const response = await fetch(`${API_BASE}/admin/notes`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};
