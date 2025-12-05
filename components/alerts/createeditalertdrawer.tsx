"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetHeader, SheetTitle, SheetContent, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, X, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Alert } from "@/lib/alertTypes"
import api from "@/lib/axios"

interface CreateEditAlertDrawerProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  alert: Alert | null
  alerts: Alert[]
  onCreateAlert: (alert: Alert) => void
  onUpdateAlert: (alert: Alert) => void
}

export function CreateEditAlertDrawer({
  isOpen,
  onClose,
  mode,
  alert,
  onCreateAlert,
  onUpdateAlert,
}: CreateEditAlertDrawerProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "system" as Alert["type"],
    recipient: "all_users" as Alert["recipient"],
    deliveryMethod: "push" as Alert["deliveryMethod"],
    deliveryDate: new Date(),
    deliveryTime: "12:00",
    imageUrl: "",
    actionUrl: "",
    tags: [] as string[],
    sendImmediately: false,
    userIds: [] as number[],
    recipientGrade: "vip"
  })

  const [users, setUsers] = useState<{ id: number; name: string; grade: string }[]>([])
  const [newTag, setNewTag] = useState("")
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  useEffect(() => {
    if (formData.recipient === "specific" && isOpen) {
      api.get("/api/users").then((res) => {
        setUsers(res.data)
      }).catch((err) => {
        console.error("사용자 목록 불러오기 실패", err)
      })
    }
  }, [formData.recipient, isOpen])

  useEffect(() => {
    if (mode === "edit" && alert) {
      const [date, time] = (alert?.deliveryTime ?? "").split(" ")
      setFormData({
        title: alert.title,
        content: alert.content,
        type: alert.type,
        recipient: alert.recipient,
        deliveryMethod: alert.deliveryMethod,
        deliveryDate: new Date(date),
        deliveryTime: time,
        imageUrl: alert.imageUrl || "",
        actionUrl: alert.actionUrl || "",
        tags: alert.tags || [],
        sendImmediately: false,
        userIds: alert.userIds || [],
        recipientGrade: "vip"
      })
    } else {
      setFormData({
        title: "",
        content: "",
        type: "system",
        recipient: "all_users",
        deliveryMethod: "push",
        deliveryDate: new Date(),
        deliveryTime: "12:00",
        imageUrl: "",
        actionUrl: "",
        tags: [],
        sendImmediately: false,
        userIds: [],
        recipientGrade: "vip"
      })
    }
  }, [mode, alert, isOpen])

  useEffect(() => {
    if (formData.recipient === "specific" && users.length > 0) {
      const filteredIds = users.filter((u) => u.grade === formData.recipientGrade).map((u) => u.id)
      setFormData((prev) => ({ ...prev, userIds: filteredIds }))
    }
  }, [formData.recipientGrade, formData.recipient, users])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const composedDeliveryTime = formData.sendImmediately
      ? format(new Date(), "yyyy-MM-dd HH:mm")
      : `${format(formData.deliveryDate, "yyyy-MM-dd")} ${formData.deliveryTime}`

    const alertData: Alert = {
      ...formData,
      id: mode === "create" ? `ALT-${Date.now()}` : alert?.id!,
      deliveryTime: composedDeliveryTime,
      scheduledAt: formData.sendImmediately ? undefined : composedDeliveryTime,
      createdAt: mode === "create" ? format(new Date(), "yyyy-MM-dd HH:mm") : alert?.createdAt!,
      status: mode === "create"
        ? (formData.sendImmediately ? "sent" : "scheduled")
        : alert?.status!,
    }

    try {
      const endpoint = mode === "create"
        ? "/api/notifications"
        : `/api/notifications/${alertData.id}`

      const response = mode === "create"
        ? await api.post(endpoint, alertData)
        : await api.put(endpoint, alertData)

      const saved = response.data
      mode === "create" ? onCreateAlert(saved) : onUpdateAlert(saved)
      onClose()
    } catch (err: any) {
      console.error("알림 저장 실패", err)
      console.error("백엔드 오류 메시지:", err.response?.data)
      window.alert("알림 저장에 실패했습니다.")
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto p-6">
        <SheetHeader className="flex flex-col !p-0 gap-4">
          <SheetTitle className="text-foreground font-semibold text-lg">
            {mode === "create" ? "새 알림 생성" : "알림 수정"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            알림 내용을 입력하고 전송 방법을 선택하세요.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">내용 *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>알림 유형</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Alert["type"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">시스템</SelectItem>
                    <SelectItem value="ride_closed">운휴 알림</SelectItem>
                    <SelectItem value="ride_resumed">운행 재개</SelectItem>
                    <SelectItem value="event">이벤트</SelectItem>
                    <SelectItem value="parade">퍼레이드</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>수신자</Label>
              <RadioGroup
                value={formData.recipient}
                onValueChange={(value) => setFormData({ ...formData, recipient: value as Alert["recipient"] })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all_users" id="all_users" />
                  <Label htmlFor="all_users">전체 사용자</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <Label htmlFor="specific">특정 등급 사용자</Label>
                </div>
              </RadioGroup>
            </div>
            {formData.recipient === "specific" && (
              <div className="space-y-2">
                <Label>대상 등급 선택</Label>
                <Select
                  value={formData.recipientGrade}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, recipientGrade: value as "vip" | "일반" }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="일반">일반</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>전송 방법</Label>
              <Select
                value={formData.deliveryMethod}
                onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value as Alert["deliveryMethod"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push">푸시 알림</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sendImmediately}
                onChange={(e) => setFormData({ ...formData, sendImmediately: e.target.checked })}
              />
              <Label>즉시 전송</Label>
            </div>
            {!formData.sendImmediately && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>전송 날짜</Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.deliveryDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deliveryDate instanceof Date && !isNaN(formData.deliveryDate.getTime())
                          ? format(formData.deliveryDate, "yyyy-MM-dd")
                          : "날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.deliveryDate}
                        onSelect={(date) => {
                          if (date) {
                            setFormData({ ...formData, deliveryDate: date })
                            setDatePickerOpen(false)
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">전송 시간</Label>
                  <Input
                    id="deliveryTime"
                    type="time"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">이미지 URL (선택사항)</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionUrl">액션 URL (선택사항)</Label>
              <Input
                id="actionUrl"
                value={formData.actionUrl}
                onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>태그</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="태그 입력"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              {mode === "create" ? "알림 생성" : "알림 수정"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}