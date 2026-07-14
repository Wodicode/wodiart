import { Hero } from "@/components/Hero";
import { IntakeForm } from "@/components/IntakeForm";
import { DirectContact } from "@/components/DirectContact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <IntakeForm />
      <DirectContact />
      <Footer />
    </main>
  );
}
