import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Scratch Programming for Kids',
    description: 'Learn programming fundamentals through visual block-based coding with Scratch.',
    level: 'Beginner',
    duration: '8 weeks',
    students: 450,
    rating: 4.9,
    price: 'Free',
    image: '/kids-coding-blocks.png',
    category: 'Kids',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: 2,
    title: 'C++ Programming Fundamentals',
    description: 'Master the basics of C++ programming language with hands-on projects.',
    level: 'Beginner',
    duration: '12 weeks',
    students: 320,
    rating: 4.8,
    price: '$99',
    image: '/c-code-on-screen.png',
    category: 'Programming',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    description: 'Start your programming journey with Python, the most beginner-friendly language.',
    level: 'Beginner',
    duration: '10 weeks',
    students: 680,
    rating: 4.9,
    price: '$79',
    image: '/placeholder-p1ahj.png',
    category: 'Programming',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    id: 4,
    title: 'Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, and modern frameworks to build amazing websites.',
    level: 'Intermediate',
    duration: '16 weeks',
    students: 520,
    rating: 4.8,
    price: '$149',
    image: '/web-dev-code.png',
    category: 'Web Dev',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
]

export function CoursesPreview() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Courses</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed courses that take you from beginner to professional level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute top-3 left-3 ${course.color}`}>
                  {course.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                  <div className="text-lg font-bold text-primary">{course.price}</div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full group" asChild>
                  <Link href={`/courses/${course.id}`}>
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
