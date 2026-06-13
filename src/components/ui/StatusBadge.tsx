type StatusBadgeProps = {
  status: string | number | null | undefined;
  label?: string;
};

function statusClasses(status: string) {
  const normalized = status.toLowerCase();
  if (["active", "paid", "accepted", "success"].includes(normalized)) return "bg-green-100 text-green-700";
  if (["pending_verification", "pending", "queued", "processing"].includes(normalized)) return "bg-amber-100 text-amber-700";
  if (["inactive", "demo", "draft"].includes(normalized)) return "bg-slate-100 text-slate-700";
  if (["live", "submitted", "ready"].includes(normalized)) return "bg-blue-100 text-blue-700";
  if (["unpaid", "failed", "rejected"].includes(normalized)) return "bg-red-100 text-red-700";
  return "bg-[#DADEFD] text-[#0001B1]";
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const value = String(label ?? status ?? "unknown");

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses(String(status ?? value))}`}>
      {value.replace(/_/g, " ")}
    </span>
  );
}
