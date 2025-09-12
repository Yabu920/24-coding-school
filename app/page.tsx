import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { StatsSection } from '@/components/home/stats-section'
import { CoursesPreview } from '@/components/home/courses-preview'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <CoursesPreview />
        <WhyChooseUs />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
