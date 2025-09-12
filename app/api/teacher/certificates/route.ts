
// // app/api/teacher/certificates/route.ts
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";

// export async function GET() {
//   try {
//     // Fetch all certificates, include student -> user
//     const certificates = await prisma.certificates.findMany({
//       orderBy: { issued_date: "desc" },
//       include: {
//         student: {
//           include: {
//             user: { select: { id: true, full_name: true, email: true } },
//           },
//         },
//       },
//     });

//     // Map the result to front-end friendly format
//     const result = certificates.map(cert => ({
//       id: cert.id,
//       studentId: cert.student_id,
//       studentName: cert.student.user.full_name,
//       studentEmail: cert.student.user.email,
//       courseName: cert.course_name,
//       issued_at: cert.issued_date.toISOString(),
//       file_url: cert.file_url || undefined,
//     }));

//     return NextResponse.json({ certificates: result });
//   } catch (err) {
//     console.error("❌ GET certificates error:", err);
//     return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const studentId = formData.get("studentId")?.toString();
//     const courseName = formData.get("courseName")?.toString();
//     const file = formData.get("file") as File | null;

//     if (!studentId || !courseName) {
//       return NextResponse.json(
//         { error: "Student and course name required" },
//         { status: 400 }
//       );
//     }

//     let fileUrl: string | undefined;

//     // Handle file upload
//     if (file && typeof file.arrayBuffer === "function") {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uploadsDir = path.join(process.cwd(), "public", "certificates");
//       await fs.mkdir(uploadsDir, { recursive: true });
//       const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//       const filePath = path.join(uploadsDir, safeName);
//       await fs.writeFile(filePath, buffer);
//       fileUrl = `/certificates/${safeName}`;
//     }

//     // Create certificate in database
//     const certificate = await prisma.certificates.create({
//       data: {
//         student_id: studentId,
//         course_name: courseName,
//         file_url: fileUrl,
//       },
//       include: {
//         student: {
//           include: {
//             user: { select: { id: true, full_name: true, email: true } },
//           },
//         },
//       },
//     });

//     // Return the created certificate
//     return NextResponse.json({
//       certificate: {
//         id: certificate.id,
//         studentId: certificate.student_id,
//         studentName: certificate.student.user.full_name,
//         studentEmail: certificate.student.user.email,
//         courseName: certificate.course_name,
//         issued_at: certificate.issued_date.toISOString(),
//         file_url: certificate.file_url || undefined,
//       },
//     });
//   } catch (err) {
//     console.error("❌ POST certificates error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import path from "path";

// export async function GET() {
//   try {
//     const certificates = await prisma.certificates.findMany({
//       orderBy: { issued_date: "desc" },
//       include: {
//         student: { include: { user: true } },
//         course: true,
//       },
//     });

//     const result = certificates.map(cert => ({
//       id: cert.id,
//       studentId: cert.student_id,
//       studentName: cert.student?.user?.full_name ?? "Unknown",
//       studentEmail: cert.student?.user?.email ?? "N/A",
//       courseName: cert.course?.name ?? cert.course_name, // fallback to old field
//       issuedAt: cert.issued_date.toISOString(),
//       fileUrl: cert.file_url || undefined,
//     }));

//     return NextResponse.json({ certificates: result });
//   } catch (err) {
//     console.error("❌ Error fetching certificates:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch certificates" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const studentId = formData.get("studentId")?.toString();
//     const courseId = formData.get("courseId")?.toString();
//     const courseName = formData.get("courseName")?.toString();
//     const file = formData.get("file") as File | null;

//     if (!studentId || !courseId || !courseName) {
//       return NextResponse.json(
//         { error: "Student, course and course name are required" },
//         { status: 400 }
//       );
//     }

//     let fileUrl: string | undefined;

//     if (file && typeof file.arrayBuffer === "function") {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const uploadsDir = path.join(process.cwd(), "public", "certificates");
//       await fs.mkdir(uploadsDir, { recursive: true });
//       const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//       const filePath = path.join(uploadsDir, safeName);
//       await fs.writeFile(filePath, buffer);
//       fileUrl = `/certificates/${safeName}`;
//     }

//     const certificate = await prisma.certificates.create({
//       data: {
//         student_id: studentId,
//         course_id: courseId,
//         course_name: courseName, // required by schema
//         file_url: fileUrl,
//       },
//       include: {
//         student: { include: { user: true } },
//         course: true,
//       },
//     });

//     return NextResponse.json({
//       certificate: {
//         id: certificate.id,
//         studentId: certificate.student_id,
//         studentName: certificate.student?.user?.full_name ?? "Unknown",
//         studentEmail: certificate.student?.user?.email ?? "N/A",
//         courseName: certificate.course?.name ?? certificate.course_name,
//         issuedAt: certificate.issued_date.toISOString(),
//         fileUrl: certificate.file_url || undefined,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Error creating certificate:", err);
//     return NextResponse.json(
//       { error: "Failed to create certificate" },
//       { status: 500 }
//     );
//   }
// }


// app/api/teacher/certificates/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { v4 as uuid } from "uuid"
import fs from "fs"
import path from "path"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const certs = await prisma.certificates.findMany({
    include: {
      student: { include: { user: true } },
    },
    orderBy: { issued_date: "desc" },
  })

  const certificates = certs.map(c => ({
    id: c.id,
    studentId: c.student_id,
    studentName: c.student.user.full_name,
    studentEmail: c.student.user.email,
    courseName: c.course_name,
    issued_at: c.issued_date.toISOString(),
    file_url: c.file_url || null,
  }))

  return NextResponse.json({ certificates })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const studentId = formData.get("studentId") as string
  const courseName = formData.get("courseName") as string
  const file = formData.get("file") as File | null

  if (!studentId || !courseName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  let fileUrl: string | null = null
  if (file) {
    // store file locally (you can replace with S3/Cloudinary later)
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const filename = `${uuid()}-${file.name}`
    const filePath = path.join(uploadDir, filename)
    fs.writeFileSync(filePath, buffer)
    fileUrl = `/uploads/${filename}`
  }

  const certificate = await prisma.certificates.create({
    data: {
      student_id: studentId,
      course_name: courseName,
      issued_date: new Date(),
      file_url: fileUrl,
    },
    include: {
      student: { include: { user: true } },
    },
  })

  return NextResponse.json({
    certificate: {
      id: certificate.id,
      studentId: certificate.student_id,
      studentName: certificate.student.user.full_name,
      studentEmail: certificate.student.user.email,
      courseName: certificate.course_name,
      issued_at: certificate.issued_date.toISOString(),
      file_url: certificate.file_url,
    },
  })
}

// // app/api/teacher/certificates/route.ts
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// export async function GET() {
//   const session = await getServerSession(authOptions)
//   if (!session || session.user.role !== "teacher") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const teacherId = session.user.id

//   // 1. Find teacher record (link teacher -> user_id)
//   const teacher = await prisma.teachers.findUnique({
//     where: { user_id: teacherId },
//   })

//   if (!teacher) {
//     return NextResponse.json({ students: [] })
//   }

//   // 2. Find all student enrollments in courses taught by this teacher
//   const studentCourses = await prisma.student_courses.findMany({
//     where: {
//       course: {
//         teacher_courses: {
//           some: { teacher_id: teacher.id },
//         },
//       },
//     },
//     include: {
//       student: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   })

//   // 3. Map + deduplicate students
//   const students = studentCourses.map(sc => ({
//     id: sc.student.id,
//     full_name: sc.student.user.full_name,
//     email: sc.student.user.email,
//   }))

//   const uniqueStudents = Array.from(new Map(students.map(s => [s.id, s])).values())

//   return NextResponse.json({ students: uniqueStudents })
// }
