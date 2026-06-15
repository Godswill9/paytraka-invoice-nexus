import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("api client helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ success: true }))));
    vi.stubGlobal("window", { location: { href: "" } });
  });

  it("extracts API error messages from axios response bodies", async () => {
    const { getApiErrorMessage } = await import("./client");
    const error = new axios.AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { message: "Email is required" },
      status: 422,
      statusText: "Unprocessable Entity",
      headers: {},
      config: {} as never,
    });

    expect(getApiErrorMessage(error, "Fallback")).toBe("Email is required");
  });

  it("falls back to native error messages and default text", async () => {
    const { getApiErrorMessage } = await import("./client");

    expect(getApiErrorMessage(new Error("Network unavailable"), "Fallback")).toBe("We could not reach PayTraka right now. Check your connection and try again.");
    expect(getApiErrorMessage("unknown", "Fallback")).toBe("Fallback");
  });

  it("maps auth and validation failures to useful user-facing messages", async () => {
    const { getApiErrorMessage } = await import("./client");

    expect(getApiErrorMessage(new axios.AxiosError("Unauthorized", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { success: false },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: {} as never,
    }))).toBe("The email or password you entered is incorrect.");

    expect(getApiErrorMessage(new axios.AxiosError("Conflict", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { success: false },
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: {} as never,
    }))).toBe("An account with this email already exists. Sign in or use another email.");

    expect(getApiErrorMessage(new axios.AxiosError("Validation", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { success: false, errors: { email: ["Enter a valid email address"] } },
      status: 422,
      statusText: "Unprocessable Entity",
      headers: {},
      config: {} as never,
    }))).toBe("email: Enter a valid email address");
  });

  it("maps backend and unexpected network failures without leaking internals", async () => {
    const { getApiErrorMessage } = await import("./client");

    expect(getApiErrorMessage(new axios.AxiosError("fetch failed: certificate mismatch", "ERR_NETWORK"))).toBe("We could not reach PayTraka right now. Check your connection and try again.");
    expect(getApiErrorMessage(new axios.AxiosError("Server exploded", "ERR_BAD_RESPONSE", undefined, undefined, {
      data: { success: false, message: "stack trace: secret" },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {} as never,
    }))).toBe("PayTraka is temporarily unavailable. Please try again in a few minutes.");
  });

  it("uses same-origin proxy URLs in the browser to avoid mixed-content requests", async () => {
    const { default: apiClient, publicApiClient } = await import("./client");

    expect(apiClient.defaults.baseURL).toBe("/api/proxy");
    expect(publicApiClient.defaults.baseURL).toBe("/api/proxy");
  });

  it("clears the local session and redirects when a browser-side protected request receives 401", async () => {
    const { default: apiClient } = await import("./client");
    let adapterCalls = 0;
    apiClient.defaults.adapter = async (config) => {
      adapterCalls += 1;
      return Promise.reject(new axios.AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
        data: { success: false, message: "Unauthorized" },
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
      }));
    };

    await expect(apiClient.get("/customers")).rejects.toThrow("Unauthorized");

    expect(adapterCalls).toBe(1);
    expect(fetch).toHaveBeenCalledWith("/api/auth/session", { method: "DELETE" });
    expect(window.location.href).toBe("/login?session=expired");
  });
});
