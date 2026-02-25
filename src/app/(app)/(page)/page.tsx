import { Cta } from "@/components/sections/page/cta";
import { FaqSection } from "@/components/sections/page/faq-section";
import { Footer } from "@/components/sections/page/footer";
import { Hero } from "@/components/sections/page/hero";
import { HowItWorks } from "@/components/sections/page/how-it-works";
import { Header } from "@/components/sections/page/navigation";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <FaqSection />
      <Cta />
      <Footer />
    </main>
  );
}

