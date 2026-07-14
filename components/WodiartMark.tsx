import Image from "next/image";

export function WodiartMark({
  className = "",
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo/wodiart-mark-white.png"
        alt=""
        aria-hidden="true"
        width={162}
        height={125}
        priority
        className="h-6 w-auto shrink-0"
      />
      {showWordmark && (
        <span className="font-display text-sm font-bold uppercase tracking-[0.28em]">
          Wodiart
        </span>
      )}
    </div>
  );
}
