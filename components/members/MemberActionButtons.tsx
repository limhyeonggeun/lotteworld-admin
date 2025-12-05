"use client"

import { Eye, Send, UserCheck, Shield, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MemberActionButtonsProps {
  memberId: string
  isAdmin: boolean
  status: "active" | "inactive" | "suspended" | "deleted"
  onView: () => void
  onSendNotification: () => void
  onToggleStatus: () => void
  onToggleAdmin: () => void
}

export default function MemberActionButtons({
  memberId,
  isAdmin,
  status,
  onView,
  onSendNotification,
  onToggleStatus,
  onToggleAdmin,
}: MemberActionButtonsProps) {  
  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm" onClick={onView}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onSendNotification}>
        <Send className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={onToggleStatus}>
        {status === "active" ? (
          <XCircle className="h-4 w-4" />
        ) : status === "suspended" ? (
          <UserCheck className="h-4 w-4" />
        ) : status === "deleted" ? (
          <UserCheck className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="sm" onClick={onToggleAdmin}>
        <Shield className="h-4 w-4" />
      </Button>
    </div>
  )
}