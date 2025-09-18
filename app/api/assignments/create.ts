// import prisma from "@/lib/prisma";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { title, description, courseId, teacherId } = req.body;

//       // 1. Save assignment
//       const assignment = await prisma.assignment.create({
//         data: {
//           title,
//           description,
//           courseId,
//           teacherId,
//         },
//       });

//       // 2. Find all students enrolled in that course
//       const students = await prisma.enrollment.findMany({
//         where: { courseId },
//         select: { studentId: true },
//       });

//       // 3. Insert notification for each student
//       await prisma.notification.createMany({
//         data: students.map((s) => ({
//           userId: s.studentId,
//           type: "new_assignment",
//           message: `📘 New assignment posted: ${title}`,
//         })),
//       });

//       res.status(200).json({ assignment });
//     } catch (error) {
//       console.error("Error creating assignment:", error);
//       res.status(500).json({ error: "Failed to create assignment" });
//     }
//   }
// }
