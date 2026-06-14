export function CurrencyAmount({ amount, currency = "NGN" }: { amount: number | string | null | undefined; currency?: string }) {
  const numericAmount = typeof amount === "number" ? amount : Number(amount ?? 0);

  return (
    <span>
      {new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(Number.isFinite(numericAmount) ? numericAmount : 0)}
    </span>
  );
}
