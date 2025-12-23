const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const defaultHeaders = () => ({
  'Content-Type': 'application/json',
});

const authHeaders = () => {
  const token = localStorage.getItem('credit_transfer_token');
  if (!token) return defaultHeaders();
  return {
    ...defaultHeaders(),
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
    throw new Error(message);
  }
  return data;
};

const buildUrl = (path) => {
  const base = API_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
};

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), options);
  return handleResponse(response);
};

// Auth APIs
export const login = async (credentials) => {
  const data = await request('/auth/login', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(credentials),
  });
  
  if (data?.token) {
    localStorage.setItem('credit_transfer_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(data.user));
  }
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('credit_transfer_token');
  localStorage.removeItem('user_info');
};

// Khoa APIs
export const khoaApi = {
  getAll: () => request('/khoa', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/khoa/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/khoa', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/khoa/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/khoa/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Chuong trinh APIs
export const chuongTrinhApi = {
  getAll: () => request('/chuong-trinh', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/chuong-trinh/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/chuong-trinh', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/chuong-trinh/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/chuong-trinh/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Hoc phan APIs
export const hocPhanApi = {
  getAll: () => request('/hoc-phan', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/hoc-phan/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/hoc-phan', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/hoc-phan/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/hoc-phan/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Chuong trinh hoc phan APIs
export const chuongTrinhHocPhanApi = {
  getAll: () => request('/chuong-trinh-hoc-phan', { method: 'GET', headers: authHeaders() }),
  getByChuongTrinh: (chuongTrinhId) => request(`/chuong-trinh-hoc-phan/chuong-trinh/${chuongTrinhId}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/chuong-trinh-hoc-phan', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/chuong-trinh-hoc-phan/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Lop APIs
export const lopApi = {
  getAll: () => request('/lop', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/lop/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/lop', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/lop/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/lop/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Sinh vien APIs
export const sinhVienApi = {
  getAll: () => request('/sinh-vien', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/sinh-vien/${id}`, { method: 'GET', headers: authHeaders() }),
  getByMaSV: (maSV) => request(`/sinh-vien/search?maSV=${encodeURIComponent(maSV)}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/sinh-vien', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/sinh-vien/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/sinh-vien/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Dot xet APIs
export const dotXetApi = {
  getAll: () => request('/dot-xet', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/dot-xet/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/dot-xet', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/dot-xet/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/dot-xet/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Chuyen diem APIs
export const chuyenDiemApi = {
  getAll: () => request('/chuyen-diem', { method: 'GET', headers: authHeaders() }),
  getByDotXet: (dotXetId) => request(`/chuyen-diem/dot-xet/${dotXetId}`, { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/chuyen-diem/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/chuyen-diem', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/chuyen-diem/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/chuyen-diem/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Users APIs (Dành cho Admin)
export const usersApi = {
  getAll: () => request('/users', { method: 'GET', headers: authHeaders() }),
  getById: (id) => request(`/users/${id}`, { method: 'GET', headers: authHeaders() }),
  create: (data) => request('/users', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  update: (id, data) => request(`/users/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE', headers: authHeaders() }),
};

// Import APIs
export const importApi = {
  sinhVien: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('credit_transfer_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return request('/import/sinh-vien', {
      method: 'POST',
      headers,
      body: formData,
    });
  },
  
  hocPhan: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('credit_transfer_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return request('/import/hoc-phan', {
      method: 'POST',
      headers,
      body: formData,
    });
  },
  
  chuyenDiem: async (file, dotXetId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dot_xet_id', dotXetId);
    
    const token = localStorage.getItem('credit_transfer_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return request('/import/chuyen-diem', {
      method: 'POST',
      headers,
      body: formData,
    });
  },
};

// Export APIs
export const exportApi = {
  chuyenDiemByDotXet: async (dotXetId) => {
    const token = localStorage.getItem('credit_transfer_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(buildUrl(`/export/chuyen-diem/dot-xet/${dotXetId}`), {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || 'Export failed');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chuyen_diem_dot_${dotXetId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return { success: true };
  },
};

