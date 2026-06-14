import { describe, expect, it } from "vitest";
import { getAuthPageRedirect, getAuthSuccessRedirect } from "./auth-flow";
import { defaultOnboardingState } from "./onboarding-store";

describe("auth flow redirects", () => {
  it("keeps signup/login pages visible when stale onboarding completion exists without a real session", () => {
    const state = { ...defaultOnboardingState, completed: true };

    expect(getAuthPageRedirect(state, { authenticated: false })).toBeNull();
    expect(getAuthPageRedirect(state, null)).toBeNull();
  });

  it("redirects auth pages to dashboard only when a real session exists", () => {
    const state = { ...defaultOnboardingState, completed: true };

    expect(getAuthPageRedirect(state, { authenticated: true })).toBe("/dashboard");
  });

  it("keeps auth pages visible for incomplete onboarding state", () => {
    expect(getAuthPageRedirect(defaultOnboardingState, { authenticated: true })).toBeNull();
  });

  it("routes successful login/signup verification based on KYC completion", () => {
    expect(getAuthSuccessRedirect({ kyc_complete: true })).toBe("/dashboard");
    expect(getAuthSuccessRedirect({ kyc_complete: false })).toBe("/onboarding/business-details");
    expect(getAuthSuccessRedirect({})).toBe("/onboarding/business-details");
  });
});
