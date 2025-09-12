"use client"

import { FC } from "react"
import { Menu } from "lucide-react"

interface Props {
  toggleSidebar: () => void
}

const Header: FC<Props> = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <button onClick={toggleSidebar} className="md:hidden">
        <Menu />
      </button>
      <h1 className="text-lg font-semibold">Teacher Dashboard</h1>
    </header>
  )
}

export default Header
