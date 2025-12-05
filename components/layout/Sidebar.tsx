"use client"

import React, { useEffect, useState } from "react"
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  MessageSquare,
  Settings,
  ServerCog,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
  { icon: UserCheck, label: "회원관리", href: "/members" },
  {
    icon: Calendar,
    label: "티켓예매관리",
    href: "/tickets",
    children: [
      { label: "예매 목록", href: "/tickets" },
      { label: "티켓 등록", href: "/tickets/new" },
    ],
  },
  {
    icon: ServerCog,
    label: "시스템 관리",
    href: "/system",
    children: [
      { label: "알림 관리", href: "/system/notifications" },
      { label: "지도/POI 관리", href: "/system/poi" },
      { label: "운휴 정보 등록", href: "/system/maintenance" },
    ],
  },
  { icon: MessageSquare, label: "공지사항/FAQ", href: "/notices" },
  { icon: Settings, label: "설정", href: "/settings" },
]

function SidebarComponent() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-60 bg-surface-light dark:bg-surface-dark">
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">롯데월드</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">관리자 페이지</p>
      </div>
      <nav className="mt-6">
        {sidebarItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <div key={index}>
              <Link
                href={item.href}
                className={`flex items-center px-6 py-4 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-900 border-r-4 border-blue-500 font-semibold dark:bg-blue-500 dark:text-white dark:border-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
                }`}
              >
                {React.createElement(item.icon, { className: "mr-3 h-5 w-5" })}
                {item.label}
              </Link>

              {item.children && isActive && (
                <div className="ml-12">
                  {item.children.map((child, idx) => {
                    const isSubActive = pathname === child.href
                    return (
                      <Link
                        key={idx}
                        href={child.href}
                        className={`block py-2 text-sm ${
                          isSubActive
                            ? "text-blue-700 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        • {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default SidebarComponent