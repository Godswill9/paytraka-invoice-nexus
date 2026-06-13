"use client";

import { useCallback, useEffect, useState } from "react";
import * as firsApi from "@/lib/api/firs";
import { getApiErrorMessage } from "@/lib/api/client";
import { FirsHealth, FirsPaymentStatusRequest, FirsQrCode, FirsSubmitRequest } from "@/types/api";

export function useFirs() {
  const [health, setHealth] = useState<FirsHealth | null>(null);
  const [qrCode, setQrCode] = useState<FirsQrCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await firsApi.checkFirsHealth();
      setHealth(response.data);
      return response.data;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to check FIRS health"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  async function submit(data: FirsSubmitRequest) {
    return firsApi.submitToFirs(data);
  }

  async function updatePaymentStatus(data: FirsPaymentStatusRequest) {
    return firsApi.updateFirsPaymentStatus(data);
  }

  async function loadQrCode(invoiceId: string) {
    const response = await firsApi.getFirsQrCode(invoiceId);
    setQrCode(response.data);
    return response.data;
  }

  return { health, qrCode, loading, error, checkHealth, submit, updatePaymentStatus, loadQrCode };
}
