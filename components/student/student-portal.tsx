"use client"

import type React from "react"

import type { students, homework as Homework, student_assignments } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

type StudentWithRelations =
  | (students & {
      user: { full_name: string }
      certificates: { id: string; course_name: string; file_url: string | null }[]
      student_assignments: (student_assignments & { assignment: { id: string; title: string } })[]
    })
  | null

export default function StudentPortal({
  student,
  homework,
}: {
  student: StudentWithRelations
  homework: Homework[]
}) {
  const [assignmentUrl, setAssignmentUrl] = useState("")
  const [assignmentId, setAssignmentId] = useState("")

  async function uploadSubmission(e: React.FormEvent) {
    e.preventDefault()
    if (!assignmentId || !assignmentUrl) {
      toast({ title: "Missing fields", description: "Provide assignment id and file URL", variant: "destructive" })
      return
    }
    try {
      const res = await fetch("/api/student/assignments/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: assignmentId, submitted_file_url: assignmentUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      toast({ title: "Submitted", description: "Your assignment was submitted." })
      setAssignmentId("")
      setAssignmentUrl("")
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Welcome, {student?.user.full_name || "Student"}</h1>
        <p className="text-muted-foreground">Track progress, submit assignments, and access resources.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Learning Progress</span>
                <span className="text-sm text-muted-foreground">{student?.progress_score ?? 0}%</span>
              </div>
              <Progress value={student?.progress_score ?? 0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Download Certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {student?.certificates.length ? (
              student.certificates.map((c) => (
                <a key={c.id} href={c.file_url || "#"} className="text-primary hover:underline" download>
                  {c.course_name}
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No certificates yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={uploadSubmission} className="grid gap-3">
              <div>
                <label className="text-sm">Assignment ID</label>
                <Input
                  value={assignmentId}
                  onChange={(e) => setAssignmentId(e.target.value)}
                  placeholder="assignment id"
                />
              </div>
              <div>
                <label className="text-sm">File URL</label>
                <Input
                  value={assignmentUrl}
                  onChange={(e) => setAssignmentUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <Button type="submit">Upload</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {homework.length ? (
              homework.map((h) => (
                <div key={h.id} className="p-3 border rounded-md">
                  <div className="font-medium">{h.title}</div>
                  <p className="text-sm text-muted-foreground">{h.content}</p>
                  {h.file_url && (
                    <a
                      className="text-sm text-primary hover:underline"
                      href={h.file_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No homework assigned.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {student?.student_assignments.length ? (
            student.student_assignments.map((s) => (
              <div key={s.id} className="p-3 border rounded-md">
                <div className="font-medium">{s.assignment.title}</div>
                <div className="text-sm">Grade: {s.grade || "Pending"}</div>
                {s.submitted_file_url && (
                  <a
                    href={s.submitted_file_url}
                    className="text-sm text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View file
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
