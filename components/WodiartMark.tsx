export function WodiartMark({
  className = "",
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Placeholder mark — replace with the Wodiart logo SVG/PNG */}
      <svg
        viewBox="0 0 40 32"
        className="h-6 w-[30px] shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 0L10 32L20 10L30 32L40 0H31L26 18L20 3L14 18L9 0H0Z" fill="currentColor" />
      </svg>
      {showWordmark && (
        <span className="font-display text-sm font-bold uppercase tracking-[0.28em]">
          Wodiart
        </span>
      )}
    </div>
  );
}
