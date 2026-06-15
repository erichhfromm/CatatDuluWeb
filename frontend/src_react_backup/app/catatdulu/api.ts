// ============================================================
// CatatDulu API Service Layer
// Semua komunikasi ke backend Laravel terpusat di sini
// ============================================================

const BASE = '/api';

function getToken(): string {
  return localStorage.getItem('api_token') ?? '';
}

function authHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('api_token');
      window.location.reload();
    }
    const msg = data?.message ?? `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

const get = <T>(path: string) => request<T>('GET', path);
const post = <T>(path: string, body: unknown) => request<T>('POST', path, body);
const put = <T>(path: string, body: unknown) => request<T>('PUT', path, body);
const del = <T>(path: string) => request<T>('DELETE', path);

// ============================================================
// Types
// ============================================================

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  currency: string;
  date_format: string;
  theme: string;
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
}

export interface DashboardStats {
  user: { id: number; name: string; currency: string };
  balance: { total: number; monthly_income: number; monthly_expense: number; net_monthly: number };
  summary: { transactions_count: number; budgets_active: number; goals_active: number; notifications_unread: number };
}

export interface ApiTransaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  notes?: string;
  category_id: number;
  category: { id: number; name: string; color?: string };
  payment_method: string;
  transaction_date: string;
  status: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  type: 'income' | 'expense' | 'both';
  color?: string;
}

export interface ApiBudget {
  id: number;
  name: string;
  description?: string;
  amount: number;
  period: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  color?: string;
  categories?: { id: number; category_id: number; allocated_amount: number; category: ApiCategory }[];
}

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  created_at: string;
}

// ============================================================
// Dashboard API
// ============================================================
export const dashboardApi = {
  stats: () => get<DashboardStats>('/dashboard/stats'),
  recentTransactions: (limit = 5) => get<{ transactions: ApiTransaction[] }>(`/dashboard/recent-transactions?limit=${limit}`),
};

// ============================================================
// Transactions API
// ============================================================
export const transactionsApi = {
  list: (params?: { type?: string; search?: string; per_page?: number; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.search) qs.set('search', params.search);
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.page) qs.set('page', String(params.page));
    return get<{ data: ApiTransaction[]; meta: { total: number; last_page: number; current_page: number } }>(`/transactions?${qs}`);
  },
  create: (body: {
    category_id: number;
    amount: number;
    type: 'income' | 'expense';
    description: string;
    notes?: string;
    transaction_date: string;
    payment_method: string;
  }) => post<ApiTransaction>('/transactions', body),
  delete: (id: number) => del<{ message: string }>(`/transactions/${id}`),
};

// ============================================================
// Categories API
// ============================================================
export const categoriesApi = {
  list: () => get<{ data: ApiCategory[] }>('/categories'),
};

// ============================================================
// Budgets API
// ============================================================
export const budgetsApi = {
  list: () => get<{ data: ApiBudget[] }>('/budgets'),
  summary: () => get<{ total_allocated: number; total_spent: number; remaining: number }>('/budgets/summary'),
  create: (body: {
    name: string;
    amount: number;
    period: string;
    start_date: string;
    end_date: string;
    color?: string;
  }) => post<ApiBudget>('/budgets', body),
  delete: (id: number) => del<{ message: string }>(`/budgets/${id}`),
};

// ============================================================
// Profile API
// ============================================================
export const profileApi = {
  me: () => get<{ data: UserData }>('/profile'),
  update: (body: Partial<UserData>) => put<{ data: UserData }>('/profile', body),
  changePassword: (body: { current_password: string; password: string; password_confirmation: string }) =>
    post<{ message: string }>('/profile/password', body),
};

// ============================================================
// Notifications API
// ============================================================
export const notificationsApi = {
  list: () => get<{ data: ApiNotification[] }>('/notifications'),
  markRead: (id: number) => put<{ message: string }>(`/notifications/${id}/read`, {}),
  markAllRead: () => post<{ message: string }>('/notifications/read-all', {}),
};

// ============================================================
// Utility: format currency IDR
// ============================================================
export const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0);
