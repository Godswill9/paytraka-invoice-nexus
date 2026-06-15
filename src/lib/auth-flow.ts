import { OnboardingState } from "./onboarding-store";

export type SessionSnapshot = {
  authenticated?: boolean;
};

export function getAuthPageRedirect(state: OnboardingState, session: SessionSnapshot | null | undefined) {
  if (!state.completed) return null;
  return session?.authenticated ? "/dashboard" : null;
}

export function getAuthSuccessRedirect(_user?: { kyc_complete?: boolean }) {
  return "/dashboard";
}
