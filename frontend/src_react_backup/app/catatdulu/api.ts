// ============================================================
// CatatDulu API Service Layer
// Semua komunikasi ke backend Laravel terpusat di sini
// ============================================================

const BASE = '/api';

function getToken(): string {
  return localStorage.getItem('api_token') ?? '';
}

function authHeaders(isFormData = false): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isFormData = body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(isFormData),
    body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
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
  profile_picture?: string;
  bio?: string;
  total_balance: number;
  monthly_income: number;
  monthly_expense: number;
  preferences?: Record<string, boolean>;
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
  spent_amount?: number;
  remaining_amount?: number;
  percentage_used?: number;
}

export interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ApiMonthlyTrend {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export interface ApiCategoryBreakdown {
  category_id: number;
  category_name: string;
  color?: string;
  total: number;
  percentage: number;
  count: number;
}

export interface ApiComparisonStats {
  period: string;
  income: number;
  expense: number;
  net: number;
  savings_rate: number;
  days_count: number;
  average_daily_spend: number;
}

export interface ApiDetailedReport {
  period: string;
  income: number;
  expenses: number;
  net: number;
  budget_summary: {
    total_allocated: number;
    total_spent: number;
    total_remaining: number;
    average_utilization: number;
  };
  by_category: { category_name: string; total: number }[];
  transactions: {
    date: string;
    category: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }[];
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
  list: (params?: { type?: string; search?: string; per_page?: number; page?: number; from_date?: string; to_date?: string }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.search) qs.set('search', params.search);
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.page) qs.set('page', String(params.page));
    if (params?.from_date) qs.set('from_date', params.from_date);
    if (params?.to_date) qs.set('to_date', params.to_date);
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
  show: (id: number) => get<{ data: ApiTransaction }>(`/transactions/${id}`),
  delete: (id: number) => del<{ message: string }>(`/transactions/${id}`),
};

// ============================================================
// Categories API
// ============================================================
export const categoriesApi = {
  list: () => get<{ data: ApiCategory[] }>('/categories?per_page=100'),
};

// ============================================================
// Budgets API
// ============================================================
export const budgetsApi = {
  list: (params?: { from_date?: string; to_date?: string }) => {
    const qs = new URLSearchParams();
    if (params?.from_date) qs.set('from_date', params.from_date);
    if (params?.to_date) qs.set('to_date', params.to_date);
    return get<{ data: ApiBudget[] }>(`/budgets?${qs}`);
  },
  summary: () => get<{ total_allocated: number; total_spent: number; remaining: number }>('/budgets/summary'),
  create: (body: {
    name: string;
    amount: number;
    period: string;
    start_date: string;
    end_date: string;
    color?: string;
    categories?: { category_id: number; allocated_amount: number }[];
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
  uploadPicture: (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    return post<{ message: string; profile_picture: string }>('/profile/picture', fd);
  },
  getPreferences: () => get<{ currency: string; date_format: string; theme: string; preferences: Record<string, boolean> }>('/profile/preferences'),
  updatePreferences: (body: { currency?: string; date_format?: string; theme?: string; preferences?: Record<string, boolean> }) =>
    put<{ message: string; preferences: Record<string, boolean> }>('/profile/preferences', body),
  exportData: () => get<any>('/profile/export'),
  disableAccount: () => post<{ message: string }>('/profile/disable', {}),
  deleteAccount: () => del<{ message: string }>('/profile'),
};

// ============================================================
// Notifications API
// ============================================================
export const notificationsApi = {
  list: () => get<{ data: ApiNotification[] }>('/notifications'),
  unreadCount: () => get<{ unread_count: number }>('/notifications/unread-count'),
  markRead: (id: number) => put<{ message: string }>(`/notifications/${id}/read`, {}),
  markAllRead: () => post<{ message: string }>('/notifications/read-all', {}),
  delete: (id: number) => del<{ message: string }>(`/notifications/${id}`),
  deleteAll: () => del<{ message: string }>('/notifications'),
};

// ============================================================
// Analytics API
// ============================================================
export const analyticsApi = {
  monthlyTrend: (months = 6) => get<ApiMonthlyTrend[]>(`/analytics/monthly-trend?months=${months}`),
  categoryBreakdown: (type = 'expense') => get<ApiCategoryBreakdown[]>(`/analytics/category-breakdown?type=${type}`),
  comparison: (fromDate: string, toDate: string) => get<ApiComparisonStats>(`/analytics/comparison?from_date=${fromDate}&to_date=${toDate}`),
};



// ============================================================
// Reports API
// ============================================================
export const reportsApi = {
  generateDetailed: () => post<{ data: ApiDetailedReport }>('/reports/generate-detailed', {}),
  export: (format: 'csv' | 'pdf') => post<{ message: string; file_path: string; download_url: string }>('/reports/export', { format }),
};

// ============================================================
// Utility: format currency IDR
// ============================================================
export const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0);
