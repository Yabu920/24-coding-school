

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        student_courses: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const course = await prisma.courses.create({
      data: {
        name,
        description: description || null,
      },
     
    });
        const allUsers = await prisma.users.findMany({});
          await Promise.all(
            allUsers.map(user => prisma.notifications.create({
            data:{
              user_id: user.id,
              type: "new Course",
              message: `New Course Available: ${course.name}`,
            },
          })
          )
        );
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, description } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    const course = await prisma.courses.update({
      where: { id },
      data: {
        name,
        description: description || null,
      },
      include: {
        student_courses: true,
      },
    });
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.courses.delete({ where: { id } });
    return NextResponse.json({ message: 'Course deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


