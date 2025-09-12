//app/admin-dashboard/register-user/page.tsx

'use client';

import React, { useState, useEffect } from 'react';

interface Course {
  id: string;
  name: string;
}

export default function AdminRegisterUser() {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student' | 'admin'>('student');
  const [gradeLevel, setGradeLevel] = useState('');
  const [experience, setExperience] = useState<number>(0);
  const [bio, setBio] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive' | 'banned'>('active');
  const [error, setError] = useState('');

  // Fetch courses from API
  useEffect(() => {
    fetch('/api/admin/courses')
      .then(res => res.json())
      .then(data => setAvailableCourses(data))
      .catch(err => console.error(err));
  }, []);

  const handleCourseChange = (courseId: string) => {
    setCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/admin/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name,
          email,
          username,
          phone,
          password,
          role,
          grade_level: gradeLevel,
          experience,
          bio,
          courses,
          status,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to register user');
        return;
      }

      const data = await res.json();
      console.log('User registered:', data);
      alert('User registered successfully!');

      // Reset form
      setFullName('');
      setEmail('');
      setUsername('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setGradeLevel('');
      setExperience(0);
      setBio('');
      setCourses([]);
      setRole('student');
      setStatus('active');
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Internal server error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={e => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Role */}
        <select
          value={role}
          onChange={e => setRole(e.target.value as 'teacher' | 'student' | 'admin')}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        {/* Admin Status */}
        {role === 'admin' && (
          <select
            value={status}
            onChange={e => setStatus(e.target.value as 'active' | 'inactive' | 'banned')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        )}

        {/* Teacher Fields */}
        {role === 'teacher' && (
          <>
            <input
              type="number"
              placeholder="Experience (years)"
              value={experience}
              onChange={e => setExperience(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Bio / Subjects Taught"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </>
        )}

        {/* Student Fields */}
        {role === 'student' && (
          <input
            type="text"
            placeholder="Grade Level"
            value={gradeLevel}
            onChange={e => setGradeLevel(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Courses */}
        {(role === 'teacher' || role === 'student') && (
          <fieldset className="border rounded-md p-4">
            <legend className="text-gray-700 font-semibold">Select Courses</legend>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableCourses.map(course => (
                <label key={course.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={courses.includes(course.id)}
                    onChange={() => handleCourseChange(course.id)}
                    className="w-4 h-4"
                  />
                  <span>{course.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Register User
        </button>
      </form>
    </div>
  );
}




