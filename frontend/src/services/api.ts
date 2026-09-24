import { ApiResponse, StudentTableItem, StudentDetail, StudentAnalytics, DashboardStats, User, Pagination } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('edutrack_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();
  if (!response.ok || !data.success) {
    if (response.status === 401) {
      localStorage.removeItem('edutrack_token');
      localStorage.removeItem('edutrack_user');
    }
    throw new ApiError(data.message || 'An unexpected error occurred', response.status);
  }
  return data.data;
}

export const apiService = {
  // Auth API (Single Admin Authentication)
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<{ token: string; user: User }>(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<User>(res);
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });
    } catch (e) {
      // ignore logout failures
    } finally {
      localStorage.removeItem('edutrack_token');
      localStorage.removeItem('edutrack_user');
    }
  },

  // Students API
  async getStudents(page = 1, limit = 10, search = ''): Promise<{ students: StudentTableItem[]; pagination: Pagination }> {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { q: search } : {}),
    });
    const res = await fetch(`${API_BASE_URL}/students?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ students: StudentTableItem[]; pagination: Pagination }>(res);
  },

  async getStudentById(id: string): Promise<StudentDetail> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<StudentDetail>(res);
  },

  async createStudent(payload: { name: string; age: number; current_class: string; marks?: Record<string, Record<string, number>> }): Promise<StudentDetail> {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<StudentDetail>(res);
  },

  async updateStudent(id: string, payload: { name: string; age: number; current_class: string; marks?: Record<string, Record<string, number>> }): Promise<StudentDetail> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<StudentDetail>(res);
  },

  async deleteStudent(id: string): Promise<{ id: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<{ id: string; message: string }>(res);
  },

  async getStudentAnalytics(id: string): Promise<StudentAnalytics> {
    const res = await fetch(`${API_BASE_URL}/students/${id}/analytics`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<StudentAnalytics>(res);
  },

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<DashboardStats>(res);
  },
};
