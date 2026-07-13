export function ProgressBar({ posted, total }: { posted: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((posted / total) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs uppercase tracking-[0.15em] text-offwhite/50">
        <span>Posted progress</span>
        <span className="font-semibold text-greenLight">
          {pct}% <span className="text-offwhite/35">({posted}/{total})</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-offwhite/10">
        <div
          className="h-full rounded-full bg-green transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
