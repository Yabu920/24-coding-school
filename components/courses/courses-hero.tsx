import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CoursesHero() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <div className="container">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Explore Our Courses
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive collection of programming courses designed for all skill levels.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg">Search</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
