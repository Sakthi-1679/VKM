
import { User, Product, Order, CustomOrder, UserRole, OrderStatus, AuthResponse } from '../types';

// Robust API_URL determination
const getApiUrl = () => {
    // 1. If env var is set, use it (e.g. production build specific)
    if ((import.meta as any).env?.VITE_API_URL) {
        return (import.meta as any).env.VITE_API_URL;
    }
    
    // 2. If running on localhost, prefer direct connection to backend port 3001
    // This solves issues where Vite Proxy isn't running (e.g. vite preview) or fails (405 on static server)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
    }

    // 3. Fallback to relative path (assumes same-origin hosting or proxy)
    return '/api';
};

const API_URL = getApiUrl();

const apiRequest = async (endpoint: string, method: string = 'GET', body?: any) => {
  const fullUrl = `${API_URL}${endpoint}`;

  try {
    const session = getCurrentSession();
    const headers: any = { 'Content-Type': 'application/json' };
    
    if (session?.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    }

    // SECURITY: Include CSRF token on state-changing requests
    if (['POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    }

    const config: any = { method, headers };
    if (body) config.body = JSON.stringify(body);
    
    const response = await fetch(fullUrl, config);
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Server responded with ${response.status}`);
      }
      return data;
    } else {
      const text = await response.text();
      // Include fullUrl in error message for clarity
      throw new Error(`Non-JSON Error (${response.status}) at ${fullUrl}: ${text.substring(0, 100)}`);
    }

  } catch (error: any) {
    console.error(`Fetch Failure [${method} ${fullUrl}]:`, error.message);
    throw error;
  }
};

// SECURITY: Store and retrieve CSRF token.
// Stored in localStorage alongside the JWT so it survives page refreshes and
// tab reopens. Using sessionStorage would lose the token while the JWT persists,
// causing "Invalid or missing CSRF token" errors after the user closes/reopens the tab.
const getCsrfToken = (): string | null => {
  return localStorage.getItem('vkm_csrf');
};

const storeCsrfToken = (token: string) => {
  localStorage.setItem('vkm_csrf', token);
};

// SECURITY: Fetch a fresh CSRF token from the server using the stored JWT.
// Called on session restore so that users with an existing JWT but no CSRF token
// (e.g. after tab close/reopen, different deployment URL, or cleared storage)
// can still perform state-changing requests without being forced to re-login.
export const refreshCsrfToken = async (): Promise<void> => {
  try {
    const data = await apiRequest('/csrf-token');
    if (data.csrfToken) storeCsrfToken(data.csrfToken);
  } catch (e: any) {
    console.warn('Failed to refresh CSRF token:', e?.message ?? e);
    // Silently degrade – the user will see a CSRF error only if they try a
    // state-changing request, which will prompt them to log in again.
  }
};

// Auth
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const data = await apiRequest('/login', 'POST', { email, password });
  // SECURITY: Store CSRF token from login response
  if (data.csrfToken) storeCsrfToken(data.csrfToken);
  localStorage.setItem('vkm_session', JSON.stringify({ user: data.user, token: data.token }));
  return data;
};

export const register = async (userData: any): Promise<AuthResponse> => {
  const data = await apiRequest('/register', 'POST', userData);
  if (data.csrfToken) storeCsrfToken(data.csrfToken);
  localStorage.setItem('vkm_session', JSON.stringify({ user: data.user, token: data.token }));
  return data;
};

export const googleLogin = async (idToken: string): Promise<AuthResponse> => {
  const data = await apiRequest('/google-login', 'POST', { idToken });
  if (data.csrfToken) storeCsrfToken(data.csrfToken);
  localStorage.setItem('vkm_session', JSON.stringify({ user: data.user, token: data.token }));
  return data;
};

export const logout = () => {
  localStorage.removeItem('vkm_session');
  sessionStorage.removeItem('vkm_csrf'); // kept for cleanup of any legacy sessionStorage value
  localStorage.removeItem('vkm_csrf'); // SECURITY: Clear CSRF token on logout
};
export const getCurrentSession = (): AuthResponse | null => {
  const session = localStorage.getItem('vkm_session');
  try {
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

// Admin Contact
export const getAdminContact = async (): Promise<string> => {
  try {
    const data = await apiRequest('/settings/contact');
    return data.phone || '9999999999';
  } catch { return '9999999999'; }
};

export const updateAdminContact = async (phone: string): Promise<void> => {
  await apiRequest('/settings/contact', 'PUT', { phone });
};

// Users
export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    return await apiRequest(`/users/${id}`);
  } catch { return undefined; }
};

// Products
export const getProducts = async (): Promise<Product[]> => {
  try {
    return await apiRequest('/products');
  } catch { return []; }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  return await apiRequest('/products', 'POST', product);
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  return await apiRequest(`/products/${id}`, 'PUT', product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiRequest(`/products/${id}`, 'DELETE');
};

// Orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    return await apiRequest('/orders');
  } catch { return []; }
};

export const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'totalPrice' | 'productTitle' | 'productImage' | 'expectedDeliveryAt'>): Promise<Order> => {
  return await apiRequest('/orders', 'POST', orderData);
};

export const updateOrderStatus = async (type: 'normal' | 'custom', id: string, status: OrderStatus): Promise<void> => {
  const endpoint = type === 'normal' ? `/orders/${id}/status` : `/custom-orders/${id}/status`;
  await apiRequest(endpoint, 'PUT', { status });
};

export const deleteOrder = async (id: string): Promise<void> => {
  await apiRequest(`/orders/${id}`, 'DELETE');
};

// Custom Orders
export const getAllCustomOrders = async (): Promise<CustomOrder[]> => {
  try {
    return await apiRequest('/custom-orders');
  } catch { return []; }
};

export const placeCustomOrder = async (orderData: Omit<CustomOrder, 'id' | 'createdAt' | 'status' | 'deadlineAt'>): Promise<CustomOrder> => {
  return await apiRequest('/custom-orders', 'POST', orderData);
};

export const deleteCustomOrder = async (id: string): Promise<void> => {
  await apiRequest(`/custom-orders/${id}`, 'DELETE');
};

// User Specific Getters
// PERF: Server now handles user_id filtering in the SQL WHERE clause.
// These functions just call the same endpoints – the server returns only
// the current user's orders (for non-admins), eliminating the need to
// download the entire orders table and filter client-side.
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  return await getAllOrders();
};

export const getUserCustomOrders = async (userId: string): Promise<CustomOrder[]> => {
  return await getAllCustomOrders();
};
