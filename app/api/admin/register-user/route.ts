
// api/admin/register-user/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      username,
      password,
      role,
      phone,
      grade_level,
      experience,
      bio,
      courses,
    } = body;

    if (!full_name || !email || !username || !password || !role) {
      return NextResponse.json(
        { error: 'Full name, email, username, password, and role are required' },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const userData: any = {
      full_name,
      email,
      username,
      password_hash,
      role,
      phone,
      status: 'active',
    };


  
    if (role === 'student') {
      userData.student = {
        create: {
          grade_level,
          student_courses: courses?.length
            ? { create: courses.map((courseId: string) => ({ course_id: courseId })) }
            : undefined,
        },
      };
    }

    // Nested creation for teacher
    if (role === 'teacher') {
      userData.teacher = {
        create: {
          experience_years: experience,
          subjects_taught: bio,
          teacher_courses: courses?.length
            ? { create: courses.map((courseId: string) => ({ course_id: courseId })) }
            : undefined,
        },
      };
    }

    const user = await prisma.users.create({
      data: userData,
      include: { student: true, teacher: true },
    });

    //new codes

          await prisma.notifications.create({
            data: {
              user_id: user.id,
              type: "new_user",
              message: `Welcome ${user.full_name}! Your account has been created.`,
            },
          });


    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}






