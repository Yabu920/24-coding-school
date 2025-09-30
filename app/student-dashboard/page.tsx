
// app/student-dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import StudentDashboardClient from "./student-dashboard-client";

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return redirect("/login");
  }

  return <StudentDashboardClient />;
}
