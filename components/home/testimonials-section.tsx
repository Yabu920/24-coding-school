'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Quote } from 'lucide-react'
import { useEffect, useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'High School Student',
    avatar: '/young-female-student.png',
    rating: 5,
    content: 'The Python course was amazing! I went from knowing nothing about programming to building my own projects. The teachers are so supportive and patient.',
    course: 'Python for Beginners',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'University Student',
    avatar: '/young-male-student.png',
    rating: 5,
    content: 'The web development bootcamp changed my life. I landed my first internship just 3 months after completing the course. Highly recommended!',
    course: 'Web Development Bootcamp',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Parent',
    avatar: '/middle-aged-woman.png',
    rating: 5,
    content: 'My 10-year-old daughter loves the Scratch programming course. She\'s creating her own games and animations. It\'s incredible to see her creativity flourish.',
    course: 'Scratch Programming for Kids',
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'Career Changer',
    avatar: '/young-professional-man.png',
    rating: 5,
    content: 'I switched from marketing to programming thanks to 24 Coding School. The C++ course gave me a solid foundation, and now I work as a software developer.',
    course: 'C++ Programming Fundamentals',
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'College Student',
    avatar: '/young-female-college-student.png',
    rating: 5,
    content: 'The live classes and interactive assignments made learning so engaging. I never thought programming could be this fun and accessible.',
    course: 'Python for Beginners',
  },
  {
    id: 6,
    name: 'James Park',
    role: 'High School Teacher',
    avatar: '/middle-aged-teacher.png',
    rating: 5,
    content: 'I took the web development course to better understand what my students are learning. The curriculum is excellent and very well structured.',
    course: 'Web Development Bootcamp',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(testimonials.length / 3))
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const visibleTestimonials = testimonials.slice(currentIndex * 3, (currentIndex * 3) + 3)

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our students and their parents have to say about their learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 line-clamp-4">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-primary">{testimonial.course}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
