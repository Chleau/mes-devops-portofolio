import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ExperiencesSection from '@/components/ExperiencesSection';
import StackTechnique from '@/components/StackTechnique';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingParticles from '@/components/FloatingParticles';

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <FloatingParticles />
      <Header />
      
      <section id="hero">
        <HeroSection />
      </section>

      <section id="experiences">
        <ExperiencesSection />
      </section>

      <section id="stack">
        <StackTechnique />
      </section>

      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </main>
  );
}
