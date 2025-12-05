"use client"

import { useEffect, useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts"
import { BarChart3 } from "lucide-react"
import api from "@/lib/axios"

function getYAxisTicks(data: { value: number }[]) {
  const max = Math.max(...data.map(item => item.value), 0)
  const tickCount = 5
  if (max <= 3) return [0, 1, 2, 3, 4]
  const step = max <= 10 ? 2 : max <= 30 ? 5 : 10
  const top = Math.ceil(max / step) * step
  const gap = Math.ceil(top / (tickCount - 1) / step) * step
  return Array.from({ length: tickCount }, (_, i) => i * gap)
}

export default function TrendChartTabs() {
  const [activeTab, setActiveTab] = useState("reservations")
  const [reservationData, setReservationData] = useState<{ day: string; value: number }[]>([])
  const [memberData, setMemberData] = useState<{ day: string; value: number }[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [reservationsRes, membersRes] = await Promise.all([
          api.get("/api/dashboard/reservations-week"),
          api.get("/api/dashboard/members-week"),
        ])

        setReservationData(reservationsRes.data)
        setMemberData(membersRes.data)
      } catch (err) {
        console.error("트렌드 데이터 로드 실패:", err)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          트렌드 분석
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="reservations">예약 추이</TabsTrigger>
            <TabsTrigger value="members">신규 회원</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <h3 className="text-lg font-medium text-foreground mb-4">
              최근 7일간 예약 추이
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={reservationData}>
                <XAxis dataKey="day" stroke="#888" padding={{ left: 20, right: 20 }} />
                <YAxis ticks={getYAxisTicks(reservationData)} stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="members">
            <h3 className="text-lg font-medium text-foreground mb-4">
              최근 7일간 신규 가입자 수
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={memberData}>
                <XAxis dataKey="day" stroke="#888" />
                <YAxis ticks={getYAxisTicks(memberData)} stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive>
                  {memberData.map((entry, index) => {
                    const max = Math.max(...memberData.map(i => i.value))
                    const ratio = entry.value / max
                    const color = `rgba(218,41,28,${0.3 + ratio * 0.7})`
                    return <Cell key={`cell-${index}`} fill={color} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}