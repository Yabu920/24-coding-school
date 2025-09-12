'use client'

import { useState } from 'react'
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar'
import { Home, BookOpen, Calendar, MessageCircle, Upload, Download, Trophy, Settings, LogOut, Users, BarChart3, FileText, Code2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const studentNavigation = [
  { name: 'Dashboard', href: '/dashboard/student', icon: Home },
  { name: 'My Courses', href: '/dashboard/student/courses', icon: BookOpen },
  { name: 'Live Classes', href: '/dashboard/student/classes', icon: Calendar },
  { name: 'Assignments', href: '/dashboard/student/assignments', icon: Upload },
  { name: 'Resources', href: '/dashboard/student/resources', icon: Download },
  { name: 'Messages', href: '/dashboard/student/messages', icon: MessageCircle },
  { name: 'Certificates', href: '/dashboard/student/certificates', icon: Trophy },
  { name: 'Profile', href: '/dashboard/student/profile', icon: Settings },
]

const teacherNavigation = [
  { name: 'Dashboard', href: '/dashboard/teacher', icon: Home },
  { name: 'My Classes', href: '/dashboard/teacher/classes', icon: BookOpen },
  { name: 'Students', href: '/dashboard/teacher/students', icon: Users },
  { name: 'Assignments', href: '/dashboard/teacher/assignments', icon: FileText },
  { name: 'Resources', href: '/dashboard/teacher/resources', icon: Download },
  { name: 'Messages', href: '/dashboard/teacher/messages', icon: MessageCircle },
  { name: 'Schedule', href: '/dashboard/teacher/schedule', icon: Calendar },
  { name: 'Profile', href: '/dashboard/teacher/profile', icon: Settings },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
  { name: 'Students', href: '/dashboard/admin/students', icon: Users },
  { name: 'Teachers', href: '/dashboard/admin/teachers', icon: Users },
  { name: 'Courses', href: '/dashboard/admin/courses', icon: BookOpen },
  { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { name: 'Messages', href: '/dashboard/admin/messages', icon: MessageCircle },
  { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'student' | 'teacher' | 'admin'
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const navigation = userType === 'student' ? studentNavigation : 
                    userType === 'teacher' ? teacherNavigation : 
                    adminNavigation

  const userName = userType === 'student' ? 'Sarah Johnson' :
                  userType === 'teacher' ? 'Prof. Emma Wilson' :
                  'Admin User'

  const userEmail = userType === 'student' ? 'sarah@student.com' :
                   userType === 'teacher' ? 'emma@teacher.com' :
                   'admin@24codingschool.com'

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">24 Coding School</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-profile-illustration.png" alt={userName} />
                    <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">{userEmail}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
