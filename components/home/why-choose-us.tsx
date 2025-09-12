import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, Award, BookOpen, Video, MessageCircle, Shield, Globe } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with years of real-world experience in software development.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    icon: Clock,
    title: 'Flexible Learning',
    description: 'Study at your own pace with 24/7 access to course materials and recorded live sessions.',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  {
    icon: Video,
    title: 'Live Interactive Classes',
    description: 'Join live coding sessions, ask questions in real-time, and collaborate with fellow students.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Curriculum',
    description: 'From basic concepts to advanced projects, our courses cover everything you need to succeed.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
  },
  {
    icon: Award,
    title: 'Certificates & Recognition',
    description: 'Earn industry-recognized certificates upon course completion to boost your career prospects.',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900',
  },
  {
    icon: MessageCircle,
    title: 'Community Support',
    description: 'Join our active community of learners and get help from peers and mentors anytime.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900',
  },
  {
    icon: Shield,
    title: 'Progress Tracking',
    description: 'Monitor your learning progress with detailed analytics and personalized feedback.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Access courses from anywhere in the world with multi-language support and mobile compatibility.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose 24 Coding School?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best learning experience with modern teaching methods and comprehensive support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${feature.bgColor} mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
