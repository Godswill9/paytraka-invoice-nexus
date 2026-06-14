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

    expect(getApiErrorMessage(new Error("Network unavailable"), "Fallback")).toBe("Network unavailable");
    expect(getApiErrorMessage("unknown", "Fallback")).toBe("Fallback");
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
