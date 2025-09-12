
//app/admin-dashboard/courses/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

type Course = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  teacher_courses: { teacher: { user: { id: string; full_name: string } } }[];
  student_courses: { id: string }[];
};

export default function CoursesPage() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const maxRetries = 3;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/courses');
        if (!res.ok) throw new Error('Failed to fetch courses. Please try again or contact support.');
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
        setFetchError(null);
      } catch (err: any) {
        if (retryCount < maxRetries) {
          setTimeout(() => setRetryCount(prev => prev + 1), 2000);
        } else {
          setFetchError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [retryCount]);

  const onSubmit = async (data: CourseForm) => {
    try {
      const url = editingCourse ? `/api/admin/courses/${editingCourse}` : '/api/admin/courses';
      const method = editingCourse ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses(editingCourse
          ? courses.map(c => c.id === editingCourse ? updatedCourse : c)
          : [...courses, updatedCourse]);
        reset();
        setEditingCourse(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || `Failed to ${editingCourse ? 'update' : 'create'} course`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while ${editingCourse ? 'updating' : 'creating'} the course`);
    }
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course.id);
    reset({
      name: course.name,
      description: course.description || '',
    });
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }
      setCourses(courses.filter(c => c.id !== id));
      alert('Course deleted successfully');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
      {loading && <p>Loading courses...</p>}
      {fetchError && (
        <p className="text-red-500 mb-4">
          {fetchError} {retryCount < maxRetries ? `(Retrying ${retryCount + 1}/${maxRetries}...)` : ''}
        </p>
      )}
      
      {/* Create/Edit Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingCourse ? 'Edit Course' : 'Create Course'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g., Algebra I" />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} placeholder="Optional description" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || !!fetchError}>
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
              {editingCourse && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { reset(); setEditingCourse(null); }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Courses List */}
      {!loading && !fetchError && (
        <Card>
          <CardContent>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Students Enrolled</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-gray-500">No courses yet.</td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id} className="border-b">
                      <td className="p-2">{course.name}</td>
                      <td className="p-2">{course.description || 'N/A'}</td>
                      <td className="p-2">{course.student_courses?.length || 0}</td>
                      <td className="p-2 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => editCourse(course)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteCourse(course.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}