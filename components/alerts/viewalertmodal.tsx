"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Send, AlertTriangle } from "lucide-react"
import type { Alert } from "@/lib/alertTypes"
import dayjs from "dayjs"

interface ViewAlertModalProps {
  isOpen: boolean
  onClose: () => void
  alert: Alert | null
}

export function ViewAlertModal({ isOpen, onClose, alert }: ViewAlertModalProps) {
  if (!alert) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">예약됨</Badge>
      case "sent":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">전송됨</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">실패</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getRecipientText = (recipient: string) => {
    switch (recipient) {
      case "all_users":
        return "전체 사용자"
      case "vip_users":
        return "VIP 사용자"
      case "new_users":
        return "신규 사용자"
      case "specific":
        return "특정 사용자"
      default:
        return recipient
    }
  }

  const getMethodText = (method: string) => {
    switch (method) {
      case "push":
        return "푸시 알림"
      case "email":
        return "이메일"
      default:
        return method
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "system":
        return "시스템"
      case "ride_closed":
        return "어트랙션 운휴"
      case "ride_resumed":
        return "어트랙션 재개"
      case "event":
        return "이벤트"
      case "parade":
        return "공연/퍼레이드"
      default:
        return type
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl bg-content-light dark:bg-content-dark">
        <DialogDescription className="sr-only">
          이 대화 상자는 알림 상세 정보를 보여줍니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>알림 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{alert.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{alert.content}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(alert.status)}
              <Badge variant="outline">{getTypeText(alert.type)}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <Users className="mr-2 h-4 w-4" />
                수신자
              </div>
              <p>{getRecipientText(alert.recipient)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <Send className="mr-2 h-4 w-4" />
                전송 방법
              </div>
              <p>{getMethodText(alert.deliveryMethod)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <Clock className="mr-2 h-4 w-4" />
                전송 시간
              </div>
              <p>{dayjs(alert.scheduledAt).format("YYYY-MM-DD HH:mm")}</p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">생성 시간</div>
              <p>{dayjs(alert.createdAt).format("YYYY-MM-DD HH:mm")}</p>
            </div>
          </div>


          {alert.status === "failed" && (
            <>
              <Separator />
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-700 dark:text-red-400">
                    전송 실패 정보
                  </h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>대상 사용자:</strong>{" "}
                  {alert.User?.email ||
                    (alert.userIds
                      ? `#${alert.userIds}`
                      : alert.userIds?.[0]
                      ? `#${alert.userIds[0]}`
                      : "정보 없음")}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>실패 사유:</strong> {alert.failReason || "미상 (서버 응답 없음)"}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}