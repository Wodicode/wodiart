import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wodiart — Start a Project",
  description:
    "Wodiart is a brand identity studio based in Abuja, Nigeria. Tell us about your project and we'll reply within 48 hours.",
  metadataBase: new URL("https://wodiart.com"),
  openGraph: {
    title: "Wodiart — Start a Project",
    description:
      "Brand identity studio, Abuja. 200+ brands worldwide. Tell us about your project.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ink font-body text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
