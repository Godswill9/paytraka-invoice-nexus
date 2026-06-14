"use client";

import { useCallback, useEffect, useState } from "react";
import * as authApi from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { AuthUser, RegisterRequest } from "@/types/api";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authApi.getMe();
      setUser(response.data);
      return response.data;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load current user"));
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    user,
    loading,
    error,
    refresh,
    register: authApi.register,
    verifyOtp: authApi.verifyOtp,
    login: authApi.login,
    logout: authApi.logout,
  };
}

export type { RegisterRequest };
