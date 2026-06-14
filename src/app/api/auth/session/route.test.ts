import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, GET, POST } from "./route";

const cookieValues = vi.hoisted(() => new Map<string, string>());

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => {
      const value = cookieValues.get(name);
      return value ? { value } : undefined;
    },
  })),
}));

const user = {
  id: "user-1",
  first_name: "Ada",
  email: "ada@example.com",
  role: "admin",
  company_id: "company-1",
  company_status: "active",
  firs_enabled: 0,
};

describe("/api/auth/session route", () => {
  beforeEach(() => {
    cookieValues.clear();
  });

  it("returns an unauthenticated session when no access token cookie exists", async () => {
    const response = await GET();

    await expect(response.json()).resolves.toEqual({ authenticated: false, user: null });
  });

  it("returns authenticated session data from httpOnly cookies", async () => {
    cookieValues.set("paytraka_access_token", "access-token");
    cookieValues.set("paytraka_user_profile", JSON.stringify(user));

    const response = await GET();

    await expect(response.json()).resolves.toEqual({ authenticated: true, user });
  });

  it("does not crash when the user profile cookie is malformed", async () => {
    cookieValues.set("paytraka_access_token", "access-token");
    cookieValues.set("paytraka_user_profile", "{bad-json");

    const response = await GET();

    await expect(response.json()).resolves.toEqual({ authenticated: true, user: null });
  });

  it("sets access, refresh, and user profile cookies for a valid session payload", async () => {
    const response = await POST(new Request("http://localhost/api/auth/session", {
      method: "POST",
      body: JSON.stringify({ accessToken: "access-token", refreshToken: "refresh-token", user }),
    }) as never);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, user });
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("paytraka_access_token=access-token");
    expect(setCookie).toContain("paytraka_refresh_token=refresh-token");
    expect(setCookie).toContain("paytraka_user_profile=");
    expect(setCookie.toLowerCase()).toContain("httponly");
  });

  it("rejects malformed JSON payloads", async () => {
    const response = await POST(new Request("http://localhost/api/auth/session", {
      method: "POST",
      body: "{bad-json",
    }) as never);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, message: "Malformed session payload" });
  });

  it("rejects missing tokens or user data", async () => {
    const response = await POST(new Request("http://localhost/api/auth/session", {
      method: "POST",
      body: JSON.stringify({ accessToken: "access-token" }),
    }) as never);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, message: "Session tokens and user are required" });
  });

  it("clears all session cookies on logout", async () => {
    const response = await DELETE();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("paytraka_access_token=");
    expect(setCookie).toContain("paytraka_refresh_token=");
    expect(setCookie).toContain("paytraka_user_profile=");
    expect(setCookie).toContain("Max-Age=0");
  });
});
