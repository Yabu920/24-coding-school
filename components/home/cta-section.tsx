import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
      <div className="container">
        <div className="text-center text-white space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers. 
              Get started today with our comprehensive programming courses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 group" asChild>
              <Link href="/register">
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold">30-Day</div>
              <div className="text-white/80">Money Back Guarantee</div>
            </div>
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-white/80">Student Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Lifetime</div>
              <div className="text-white/80">Course Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
