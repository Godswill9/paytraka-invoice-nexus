"use client";

import { useCallback, useEffect, useState } from "react";
import * as receiptsApi from "@/lib/api/receipts";
import { getApiErrorMessage } from "@/lib/api/client";
import { Pagination, Receipt, ReceiptRequest } from "@/types/api";
import { usePagination } from "./usePagination";

export function useReceipts() {
  const pager = usePagination();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [pagination, setPagination] = useState<Pagination | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await receiptsApi.listReceipts({ page: pager.page, limit: pager.limit });
      setReceipts(response.data);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load receipts"));
    } finally {
      setLoading(false);
    }
  }, [pager.limit, pager.page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(data: ReceiptRequest) {
    const response = await receiptsApi.createReceipt(data);
    await refresh();
    return response;
  }

  return { receipts, pagination, pager, loading, error, refresh, create, getReceipt: receiptsApi.getReceipt, getReceiptsByInvoice: receiptsApi.getReceiptsByInvoice };
}
