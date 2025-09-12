import { ReactNode } from "react"
import AdminLayout from "@/components/layout/admin-layout"
import {useSession} from "next-auth/react"
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}


