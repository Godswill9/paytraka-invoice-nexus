// Mock Authentication Service
// This uses localStorage to simulate user sessions
// TODO: Replace with real authentication (e.g., JWT, OAuth, Supabase Auth)

export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
}

const STORAGE_KEY = 'paytraka_user';
const MOCK_USER: User = {
  id: '1',
  email: 'demo@paytraka.com',
  name: 'Demo User',
  businessName: 'Demo Business'
};

/**
 * Login user
 * TODO: Replace with real API call to authentication endpoint
 */
export const login = async (email: string, password: string): Promise<User> => {
  // Mock validation
  if (email && password.length >= 6) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
    return MOCK_USER;
  }
  throw new Error('Invalid credentials');
};

/**
 * Logout user
 * TODO: Replace with real API call to clear server session
 */
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
