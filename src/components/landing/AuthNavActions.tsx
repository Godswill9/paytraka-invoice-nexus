"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthNavActions({ mobile = false }: { mobile?: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((session) => setAuthenticated(Boolean(session?.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  if (mobile) {
    return (
      <Link href={authenticated ? "/dashboard" : "/login"} className="block rounded-lg px-3 py-3 text-sm font-bold text-[#0001B1] hover:bg-[#F7F9FB]">
        {authenticated ? "Open dashboard" : "Sign in"}
      </Link>
    );
  }

  return (
    <>
      {!authenticated ? <Link href="/login" className="hidden text-sm font-semibold text-[#191C1E] transition hover:text-[#0001B1] sm:inline-flex">Sign in</Link> : null}
      <Link href={authenticated ? "/dashboard" : "/signup"} className="inline-flex min-h-10 items-center rounded-lg bg-[#1117E8] px-3 text-xs font-bold text-white shadow-[0_12px_28px_rgba(17,23,232,0.2)] transition hover:bg-[#0001B1] sm:px-5 sm:text-sm">
        {authenticated ? "Dashboard" : "Get started"}
      </Link>
    </>
  );
}
