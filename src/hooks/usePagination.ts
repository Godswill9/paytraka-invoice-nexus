"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function usePagination(defaultLimit = 20) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const limit = Number(searchParams.get("limit") ?? String(defaultLimit)) || defaultLimit;
  const search = searchParams.get("search") ?? "";

  const update = useCallback((next: Partial<{ page: number; limit: number; search: string }>) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextPage = next.page ?? page;
    const nextLimit = next.limit ?? limit;
    const nextSearch = next.search ?? search;

    params.set("page", String(nextPage));
    params.set("limit", String(nextLimit));
    if (nextSearch) params.set("search", nextSearch);
    else params.delete("search");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [limit, page, pathname, router, search, searchParams]);

  return useMemo(() => ({
    page,
    limit,
    search,
    setPage: (nextPage: number) => update({ page: nextPage }),
    setLimit: (nextLimit: number) => update({ limit: nextLimit, page: 1 }),
    setSearch: (nextSearch: string) => update({ search: nextSearch, page: 1 }),
    query: { page, limit, search },
  }), [limit, page, search, update]);
}
