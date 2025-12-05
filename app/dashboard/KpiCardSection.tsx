"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, Ticket } from "lucide-react"
import api from "@/lib/axios" 

interface KpiItem {
  icon: any
  label: string
  value: string
  color: string
}

export default function KpiCardSection() {
  const [totalUsers, setTotalUsers] = useState("로딩 중...")
  const [todayReservations, setTodayReservations] = useState("로딩 중...")
  const [todayVisitors, setTodayVisitors] = useState("로딩 중...")

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          api.get("/api/users/count"),
          api.get("/api/dashboard/today"),
        ])

        setTotalUsers(userRes.data.count.toLocaleString())
        setTodayReservations(orderRes.data.reservationCount.toLocaleString())
        setTodayVisitors(orderRes.data.totalVisitors.toLocaleString())
      } catch (err) {
        console.error("KPI 불러오기 실패:", err)
        setTotalUsers("오류")
        setTodayReservations("오류")
        setTodayVisitors("오류")
      }
    }

    fetchKpis()
  }, [])

  const kpis: KpiItem[] = [
    {
      icon: Users,
      label: "오늘 방문자",
      value: todayVisitors,
      color: "text-blue-600",
    },
    {
      icon: UserCheck,
      label: "총 회원수",
      value: totalUsers,
      color: "text-green-600",
    },
    {
      icon: Ticket,
      label: "오늘 예약",
      value: todayReservations,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="border p-6 bg-white dark:bg-content-dark border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{kpi.label}</p>
              <p className="text-2xl font-bold mt-2">{kpi.value}</p>
            </div>
            <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
          </div>
        </div>
      ))}
    </div>
  )
}