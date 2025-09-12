import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Scratch Programming for Kids',
    description: 'Learn programming fundamentals through visual block-based coding with Scratch. Perfect for children aged 8-14.',
    level: 'Beginner',
    duration: '8 weeks',
    students: 450,
    rating: 4.9,
    price: 'Free',
    originalPrice: null,
    image: '/kids-coding-blocks.png',
    category: 'Kids',
    instructor: 'Ms. Sarah Johnson',
    lessons: 24,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  {
    id: 2,
    title: 'C++ Programming Fundamentals',
    description: 'Master the basics of C++ programming language with hands-on projects and real-world applications.',
    level: 'Beginner',
    duration: '12 weeks',
    students: 320,
    rating: 4.8,
    price: '$99',
    originalPrice: '$149',
    image: '/c-code-on-screen.png',
    category: 'Programming',
    instructor: 'Dr. Michael Chen',
    lessons: 36,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    description: 'Start your programming journey with Python, the most beginner-friendly and versatile programming language.',
    level: 'Beginner',
    duration: '10 weeks',
    students: 680,
    rating: 4.9,
    price: '$79',
    originalPrice: '$119',
    image: '/placeholder-p1ahj.png',
    category: 'Programming',
    instructor: 'Prof. Emma Wilson',
    lessons: 30,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    id: 4,
    title: 'Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, and modern frameworks to build amazing responsive websites and web applications.',
    level: 'Intermediate',
    duration: '16 weeks',
    students: 520,
    rating: 4.8,
    price: '$149',
    originalPrice: '$199',
    image: '/web-dev-code.png',
    category: 'Web Dev',
    instructor: 'Mr. David Rodriguez',
    lessons: 48,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
  {
    id: 5,
    title: 'Advanced JavaScript & React',
    description: 'Deep dive into modern JavaScript ES6+ features and build dynamic web applications with React.',
    level: 'Advanced',
    duration: '14 weeks',
    students: 280,
    rating: 4.7,
    price: '$179',
    originalPrice: '$229',
    image: '/react-modern-web-dev.png',
    category: 'Web Dev',
    instructor: 'Ms. Lisa Thompson',
    lessons: 42,
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  },
  {
    id: 6,
    title: 'Mobile App Development with Flutter',
    description: 'Build beautiful, native mobile applications for iOS and Android using Google\'s Flutter framework.',
    level: 'Intermediate',
    duration: '12 weeks',
    students: 195,
    rating: 4.6,
    price: '$129',
    originalPrice: '$179',
    image: '/flutter-app-development.png',
    category: 'Mobile',
    instructor: 'Mr. James Park',
    lessons: 36,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  },
]

export function CoursesGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Courses</h2>
          <p className="text-muted-foreground">Showing {courses.length} courses</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select className="border rounded-md px-3 py-1 text-sm">
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {course.originalPrice && (
                <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button size="sm" variant="secondary" className="gap-2">
                  <Play className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{course.level}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              <p className="text-sm text-muted-foreground">by {course.instructor}</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="h-4 w-4" />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {course.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="space-y-2">
              <Button className="w-full group" asChild>
                <Link href={`/courses/${course.id}`}>
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/courses/${course.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 pt-8">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <Button variant="outline" className="bg-primary text-primary-foreground">
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">
          Next
        </Button>
      </div>
    </div>
  )
}
