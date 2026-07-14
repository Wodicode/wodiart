import { CONTACT } from "@/lib/constants";

const CHANNELS = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    label: "Phone",
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneHref}`,
  },
  {
    label: "WhatsApp",
    value: CONTACT.whatsappDisplay,
    href: `https://wa.me/${CONTACT.whatsappNumber}`,
  },
];

export function DirectContact() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16">
      <div className="max-w-content border-t border-gray-800 pt-16">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Prefer to talk directly?</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.label === "WhatsApp" ? "_blank" : undefined}
              rel={channel.label === "WhatsApp" ? "noreferrer" : undefined}
              className="group block border-t border-gray-700 pt-5 transition-colors hover:border-paper"
            >
              <span className="text-xs uppercase tracking-[0.14em] text-gray-400">
                {channel.label}
              </span>
              <span className="mt-2 block text-lg text-paper transition-colors group-hover:text-gray-300">
                {channel.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
