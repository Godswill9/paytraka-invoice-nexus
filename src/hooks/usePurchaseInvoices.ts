"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api/client";
import { listPurchaseInvoices } from "@/lib/api/purchase-invoices";
import { PurchaseInvoice } from "@/types/api";

export function usePurchaseInvoices(limit = 200) {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listPurchaseInvoices({ page: 1, limit });
      setInvoices(response.data ?? []);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load purchase invoices"));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { invoices, loading, error, refresh };
}
