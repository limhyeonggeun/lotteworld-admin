"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Edit, Trash2, Send, AlertTriangle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Alert } from "@/lib/alertTypes"
import dayjs from "dayjs"

interface AlertsTableProps {
  alerts: Alert[]
  selectedAlerts: string[]
  onSelectAlert: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onViewAlert: (alert: Alert) => void
  onEditAlert: (alert: Alert) => void
  onDeleteAlert: (alertId: string) => void | Promise<void>
  onResendAlert: (alertId: string) => void | Promise<void>
  onCancelAlert: (alertId: string) => void | Promise<void> 
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export function AlertsTable({
  alerts,
  selectedAlerts,
  onSelectAlert,
  onSelectAll,
  onViewAlert,
  onEditAlert,
  onDeleteAlert,
  onResendAlert,
  currentPage,
  totalPages,
  setCurrentPage,
}: AlertsTableProps) {
  const getStatusBadge = (status: string, priority?: string) => {
    const isHighPriority = priority === "high"
    switch (status) {
      case "scheduled":
        return (
          <Badge className={cn("bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", isHighPriority && "ring-2 ring-orange-300")}>
            {isHighPriority && <AlertTriangle className="mr-1 h-3 w-3" />}
            예약됨
          </Badge>
        )
      case "sent":
        return (
          <Badge className={cn("bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", isHighPriority && "ring-2 ring-orange-300")}>
            {isHighPriority && <AlertTriangle className="mr-1 h-3 w-3" />}
            전송됨
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-2 ring-red-300">
            <AlertTriangle className="mr-1 h-3 w-3" />
            실패
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRecipientBadge = (recipient: string) => {
    switch (recipient) {
      case "all_users":
        return <Badge variant="outline">전체 사용자</Badge>
      case "specific":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300">특정 사용자</Badge>
      default:
        return <Badge variant="outline">{recipient}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "push":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">푸시</Badge>
      case "email":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">이메일</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <ScrollArea className="w-full">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={selectedAlerts.length === alerts.length && alerts.length > 0}
                  onCheckedChange={onSelectAll}
                  aria-label="모든 알림 선택"
                />
              </TableHead>
              <TableHead className="text-left w-[200px]">제목</TableHead>
              <TableHead className="text-center">수신자</TableHead>
              <TableHead className="text-center">전송 시간</TableHead>
              <TableHead className="text-center">전송 방법</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">관리</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  알림이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow
                  key={alert.id}
                  className={cn(
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    alert.status === "failed" && "bg-red-50 dark:bg-red-900/20",
                    alert.priority === "high" && alert.status === "scheduled" && "bg-orange-50 dark:bg-orange-900/20",
                  )}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedAlerts.includes(alert.id)}
                      onCheckedChange={(checked) => onSelectAlert(alert.id, checked as boolean)}
                      aria-label={`알림 ${alert.title} 선택`}
                    />
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center">
                        {alert.priority === "high" && <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />}
                        {alert.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                        {alert.content}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getRecipientBadge(alert.recipient)}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.scheduledAt ? dayjs(alert.scheduledAt).format("YYYY-MM-DD HH:mm") : "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{getMethodBadge(alert.deliveryMethod)}</TableCell>
                  <TableCell className="text-center">{getStatusBadge(alert.status, alert.priority)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onViewAlert(alert)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditAlert(alert)}
                        disabled={!(alert.status === "scheduled" || alert.status === "failed")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onResendAlert(alert.id)}>
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteAlert(alert.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant="outline"
              size="sm"
              className={currentPage === i + 1 ? "bg-blue-50 text-blue-600" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}