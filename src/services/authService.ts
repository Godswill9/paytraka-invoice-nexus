export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
}

const STORAGE_KEY = "paytraka_user";
const MOCK_USER: User = {
  id: "1",
  email: "demo@paytraka.com",
  name: "Demo User",
  businessName: "Demo Business",
};

export const login = async (email: string, password: string): Promise<User> => {
  // ✅ Fixed credentials
  const FIXED_EMAIL = "admin@paytraka.com";
  const FIXED_PASSWORD = "123456";

  // ✅ Mock user object
  const MOCK_USER: User = {
    id: "1",
    name: "Paytraka Admin",
    email: FIXED_EMAIL,
  };

  // ✅ Validate input
  if (email === FIXED_EMAIL && password === FIXED_PASSWORD) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
    return MOCK_USER;
  }

  // ❌ Invalid credentials
  throw new Error("Invalid email or password");
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
