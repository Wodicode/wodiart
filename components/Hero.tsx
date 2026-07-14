import { WodiartMark } from "@/components/WodiartMark";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between px-6 pb-8 pt-10 sm:px-10 sm:pt-12 lg:px-16">
      <div>
        <WodiartMark />
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-gray-400">
          Replies within 48 hours.
        </p>
      </div>

      <div className="max-w-content py-16 sm:py-24">
        <h1 className="font-display text-[15vw] font-bold leading-[0.92] tracking-tightest sm:text-[9vw] lg:text-[7.5rem]">
          Start a
          <br />
          project
        </h1>
        <p className="mt-8 max-w-md text-lg text-gray-300 sm:text-xl">
          Brand identity studio, Abuja. 200+ brands worldwide.
        </p>
      </div>

      <a
        href="#form"
        className="group flex items-center gap-3 self-start text-xs uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-paper"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 transition-colors group-hover:border-paper">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className="animate-bounce"
          >
            <path
              d="M6 1v9M1.5 6.5L6 10l4.5-3.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Start the intake form
      </a>
    </section>
  );
}
