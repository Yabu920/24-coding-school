'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, Calendar, MessageCircle, Upload, Download, Trophy, Clock, Play, FileText, Bell } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'

const enrolledCourses = [
  {
    id: 1,
    title: 'Python for Beginners',
    progress: 75,
    totalLessons: 30,
    completedLessons: 23,
    nextLesson: 'Functions and Parameters',
    instructor: 'Prof. Emma Wilson',
    dueDate: '2024-02-15',
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    progress: 45,
    totalLessons: 48,
    completedLessons: 22,
    nextLesson: 'CSS Grid and Flexbox',
    instructor: 'Mr. David Rodriguez',
    dueDate: '2024-03-01',
  },
]

const upcomingClasses = [
  {
    id: 1,
    title: 'Python Advanced Concepts',
    date: '2024-01-20',
    time: '10:00 AM',
    instructor: 'Prof. Emma Wilson',
    meetingLink: 'https://meet.google.com/abc-def-ghi',
  },
  {
    id: 2,
    title: 'JavaScript Fundamentals',
    date: '2024-01-22',
    time: '2:00 PM',
    instructor: 'Mr. David Rodriguez',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst',
  },
]

const recentAssignments = [
  {
    id: 1,
    title: 'Build a Calculator App',
    course: 'Python for Beginners',
    dueDate: '2024-01-25',
    status: 'pending',
    grade: null,
  },
  {
    id: 2,
    title: 'Create a Responsive Website',
    course: 'Web Development Bootcamp',
    dueDate: '2024-01-18',
    status: 'graded',
    grade: 'A',
  },
]

export function StudentDashboard() {
  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Avatar>
              <AvatarImage src="/diverse-student-profiles.png" alt="Student" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Out of 78 total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Earned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrolled Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Continue your learning progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{course.title}</h3>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>
                  <Progress value={course.progress} className="w-full" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span>by {course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next: {course.nextLesson}</span>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Live Classes</CardTitle>
              <CardDescription>Don't miss your scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((class_) => (
                <div key={class_.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{class_.title}</h3>
                    <Badge variant="outline">Live</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{class_.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{class_.time}</span>
                    </div>
                  </div>
                  <p className="text-sm">Instructor: {class_.instructor}</p>
                  <Button size="sm" className="w-full">
                    Join Class
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Track your assignment progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    <p className="text-sm">Due: {assignment.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assignment.status === 'graded' ? (
                      <Badge className="bg-green-100 text-green-800">
                        Grade: {assignment.grade}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  Upload Assignment
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Download Resources
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  Ask Question
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  View Certificates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
