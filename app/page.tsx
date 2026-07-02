import Navbar from "@/components/Navbar";
import TrustBar from "@/components/TrustBar";
import ProductCategories from "@/components/ProductCategories";
import ProduktShowcase from "@/components/ProduktShowcase";
import PhilosophieSection from "@/components/PhilosophieSection";
import StatsSection from "@/components/StatsSection";
import TeamSection from "@/components/TeamSection";
import KonfiguratorTeaser from "@/components/KonfiguratorTeaser";
import Testimonials from "@/components/Testimonials";
import KontaktCTA from "@/components/KontaktCTA";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeClient>
        <main>
          <TrustBar />
          <ProduktShowcase />
          <ProductCategories />
          <PhilosophieSection />
          <StatsSection />
          <KonfiguratorTeaser />
          <TeamSection />
          <Testimonials />
          <KontaktCTA />
          <Footer />
        </main>
      </HomeClient>
    </>
  );
}
