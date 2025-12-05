"use client"

import { useEffect, useState } from "react"
import { Bell, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/axios"
import dayjs from "dayjs"

interface AlertData {
  id: string
  title: string
  content: string
  type: "system" | "ride_closed" | "ride_resumed" | "event" | "parade"
  createdAt: string
}

const typeColorMap: Record<AlertData["type"], string> = {
  system: "bg-gray-400",
  ride_closed: "bg-yellow-400",
  ride_resumed: "bg-green-400",
  event: "bg-blue-400",
  parade: "bg-purple-400",
}

const pendingTasks = [
  { task: "예약 승인 대기", count: 12, urgent: true },
  { task: "티켓 등록 요청 처리", count: 5, urgent: true },
  { task: "알림 발송 실패", count: 2, urgent: false },
  { task: "미답변 문의사항", count: 9, urgent: false },
]

export default function RecentAlertsAndTasks() {
  const [alerts, setAlerts] = useState<AlertData[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<AlertData[]>("/api/notifications")
        const uniqueAlerts = deduplicateAlerts(res.data)
        setAlerts(uniqueAlerts.slice(0, 3))
      } catch (err) {
        console.error("알림 불러오기 실패", err)
      }
    }
    fetchAlerts()
  }, [])

  const deduplicateAlerts = (data: AlertData[]) => {
    const seen = new Set()
    return data.filter((alert) => {
      const key = `${alert.title}-${alert.content}-${alert.type}-${alert.createdAt}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const getTimeAgo = (dateStr: string) => {
    const now = dayjs()
    const created = dayjs(dateStr)
    const diffMin = now.diff(created, "minute")
    if (diffMin < 1) return "방금 전"
    if (diffMin < 60) return `${diffMin}분 전`
    const diffHr = now.diff(created, "hour")
    if (diffHr < 24) return `${diffHr}시간 전`
    const diffDay = now.diff(created, "day")
    return `${diffDay}일 전`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            최근 알림
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className={`h-5 w-5 rounded-full ${typeColorMap[alert.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getTimeAgo(alert.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            처리 대기 업무
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-muted hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${task.urgent ? "bg-red-500" : "bg-yellow-500"}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{task.task}</span>
                </div>
                <Badge variant={task.urgent ? "destructive" : "secondary"}>{task.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}