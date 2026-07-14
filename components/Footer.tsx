import { WodiartMark } from "@/components/WodiartMark";
import { CONTACT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 px-6 py-10 sm:px-10 lg:px-16">
      <div className="max-w-content flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <WodiartMark />
          <p className="mt-2 text-xs text-gray-500">Brand identity studio. Abuja.</p>
        </div>
        <a
          href={CONTACT.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-paper"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
