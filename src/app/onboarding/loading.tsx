export default function OnboardingLoading() {
  return (
    <div className="onboarding-theme min-h-screen bg-[#F5F6FA] px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl" role="status" aria-label="Loading onboarding page">
        <div className="mb-10 flex items-center justify-between">
          <div className="skeleton-shimmer h-9 w-36 rounded-lg bg-[#E6EAF2]" />
          <div className="skeleton-shimmer h-10 w-10 rounded-full bg-[#E6EAF2]" />
        </div>
        <div className="mb-12">
          <div className="skeleton-shimmer h-4 w-28 rounded bg-[#E6EAF2]" />
          <div className="skeleton-shimmer mt-3 h-10 w-3/4 max-w-xl rounded-lg bg-[#E6EAF2]" />
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#DFE3E8]">
            <div className="route-progress h-full bg-[#1117E8]" />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-2xl border border-[#C5C4DA] bg-white p-6">
              <div className="skeleton-shimmer h-6 w-44 rounded bg-[#E6EAF2]" />
              <div className="mt-6 space-y-4">
                <div className="skeleton-shimmer h-4 w-full rounded bg-[#E6EAF2]" />
                <div className="skeleton-shimmer h-4 w-5/6 rounded bg-[#E6EAF2]" />
                <div className="skeleton-shimmer h-4 w-2/3 rounded bg-[#E6EAF2]" />
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading onboarding page</span>
      </div>
    </div>
  );
}
