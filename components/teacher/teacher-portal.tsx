
"use client"

import { useState } from "react"
import type { teachers, students } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

export type TeacherWithRelations = teachers & {
  user: { full_name: string; profile_image_url?: string | null }
  live_classes: {
    id: string
    title: string
    start_time: Date
    description: string | null
  }[]
}

export default function TeacherPortal({
  teacher,
  students,
}: {
  teacher: TeacherWithRelations | null
  students: (students & { user: { full_name: string; email: string } })[]
}) {
  const [title, setTitle] = useState("")
  const [start, setStart] = useState("")
  const [desc, setDesc] = useState("")

  async function createClass(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch("/api/teacher/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc, start_time: start }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to schedule")
      toast({ title: "Class scheduled", description: data.class.title })
      setTitle("")
      setStart("")
      setDesc("")
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">
          Welcome, {teacher?.user.full_name || "Teacher"}
        </h1>
        <p className="text-muted-foreground">
          Manage classes, materials, and student progress.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {students.map((s) => (
              <div
                key={s.id}
                className="p-3 border rounded-md flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{s.user.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {s.user.email}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Live Class</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createClass} className="grid gap-3">
              <div>
                <label className="text-sm">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">Start Time</label>
                <Input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm">Description</label>
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teacher?.live_classes?.length ? (
            teacher.live_classes.map((c) => (
              <div key={c.id} className="p-3 border rounded-md">
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(c.start_time).toLocaleString()}
                </div>
                {c.description && <p className="text-sm">{c.description}</p>}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No scheduled classes.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
