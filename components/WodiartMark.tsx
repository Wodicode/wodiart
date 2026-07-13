export function WodiartMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 32" className="h-6 w-[30px]" fill="none" aria-hidden="true">
        <path d="M0 0L10 32L20 10L30 32L40 0H31L26 18L20 3L14 18L9 0H0Z" fill="currentColor" />
      </svg>
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-offwhite">
        Wodiart
      </span>
    </div>
  );
}
