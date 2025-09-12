import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CoursesGrid } from '@/components/courses/courses-grid'
import { CoursesFilters } from '@/components/courses/courses-filters'
import { CoursesHero } from '@/components/courses/courses-hero'

export default function CoursesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CoursesHero />
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <CoursesFilters />
              </div>
              <div className="lg:col-span-3">
                <CoursesGrid />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
