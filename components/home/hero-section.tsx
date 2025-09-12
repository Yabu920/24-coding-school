'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Code, Users, Award } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950 dark:via-background dark:to-cyan-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="container relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🚀 New Batch Starting Soon
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Learn to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Code
                </span>{' '}
                from Scratch to Professional
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Join thousands of students learning programming with our comprehensive courses. 
                From kids' Scratch programming to advanced web development.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">2,500+</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-semibold">15+</div>
                  <div className="text-sm text-muted-foreground">Courses</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link href="/courses">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg">
              {/* Main coding illustration */}
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 shadow-2xl">
                <div className="space-y-4">
                  {/* Code editor mockup */}
                  <div className="rounded-lg bg-slate-900 p-4">
                    <div className="flex space-x-2 mb-3">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="text-blue-400">{'function'} <span className="text-yellow-400">{'learnCoding'}</span>() {'{'}</div>
                      <div className="text-green-400 pl-4">{'console.log'}(<span className="text-orange-400">{"'Welcome to 24 Coding School!'"}</span>);</div>
                      <div className="text-blue-400">{'}'}</div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 animate-float">
                    <div className="rounded-full bg-white p-3 shadow-lg">
                      <Code className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 animate-float" style={{ animationDelay: '2s' }}>
                    <div className="rounded-full bg-white p-3 shadow-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
