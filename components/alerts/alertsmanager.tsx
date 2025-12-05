"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertsTable } from "@/components/alerts/alertstable"
import type { Alert } from "@/lib/alertTypes"
import api from "@/lib/axios"
import { useUser } from "@/context/UserContext"

export default function AlertsManager() {
  const { user } = useUser()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const alertsPerPage = 10

  const adminToken =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null

  const authHeaders = {
    Authorization: `Bearer ${adminToken || user?.token}`,
  }

  useEffect(() => {
    refreshData()
  }, [currentPage])

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [statusMessage])

  const refreshData = async () => {
    try {
      const res = await api.get(`/api/notifications`, {
        params: { page: currentPage, limit: alertsPerPage },
        headers: authHeaders,
      })
      setAlerts(res.data.alerts || [])
    } catch (error) {
      console.error("알림 가져오기 실패:", error)
    }
  }

  const handleCancelAlert = async (id: string) => {
    console.log("알림 취소:", id)
  }

  const handleBulkResend = async () => {
    try {
      const ids = selectedAlerts.map((id) => parseInt(id, 10))
      await api.post("/api/notifications/bulk-resend", { ids }, { headers: authHeaders })
      setStatusMessage("선택된 알림이 재전송되었습니다.")
      setSelectedAlerts([])
      refreshData()
    } catch (error: any) {
      console.error("일괄 재전송 실패:", error?.response?.data || error.message)
    }
  }

  const handleBulkDelete = async () => {
    try {
      const ids = selectedAlerts.map((id) => Number(id))
      await api.post("/api/notifications/bulk-delete", { ids }, { headers: authHeaders })
      setStatusMessage("선택된 알림이 삭제되었습니다.")
      setSelectedAlerts([])
      refreshData()
    } catch (error: any) {
      console.error("일괄 삭제 실패:", error?.response?.data || error.message)
    }
  }

  const handleResendAlert = async () => {
    await handleBulkResend()
  }

  const handleDeleteAlert = async () => {
    await handleBulkDelete()
  }

  const handleSelectAlert = (id: string, checked: boolean) => {
    setSelectedAlerts((prev) =>
      checked ? [...prev, id] : prev.filter((aid) => aid !== id)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedAlerts(checked ? alerts.map((a) => a.id) : [])
  }

  const totalPages = 5

  return (
    <div>
      {statusMessage && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded">
          {statusMessage}
        </div>
      )}

      {selectedAlerts.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">
            {selectedAlerts.length}개 알림 선택됨
          </span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleBulkResend}>
              일괄 재전송
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              일괄 삭제
            </Button>
          </div>
        </div>
      )}

      <AlertsTable
        alerts={alerts}
        selectedAlerts={selectedAlerts}
        onSelectAlert={handleSelectAlert}
        onSelectAll={handleSelectAll}
        onDeleteAlert={handleDeleteAlert}
        onResendAlert={handleResendAlert}
        onCancelAlert={handleCancelAlert}  
        onViewAlert={() => {}}
        onEditAlert={() => {}}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}