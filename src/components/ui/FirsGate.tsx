import { ReactNode } from "react";
import { StatusBadge } from "./StatusBadge";

export function FirsGate({ firsEnabled, children }: { firsEnabled: number; children: ReactNode }) {
  if (firsEnabled === 1) return <>{children}</>;

  return (
    <span className="inline-flex items-center gap-2" title="FIRS is not enabled for this company">
      <StatusBadge status="UNPAID" label="FIRS not enabled" />
    </span>
  );
}
