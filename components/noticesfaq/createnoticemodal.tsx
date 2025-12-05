"use client"

import type { Notice } from "@/lib/noticesfaqdata"
import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (notice: Notice) => void
}

export function CreateNoticeModal({ isOpen, onClose, onCreate }: CreateNoticeModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    priority: "low" as "low" | "medium" | "high",
    status: "draft",
    publishDate: new Date(),
    schedulePublish: false,
  })

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newNotice: Notice = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      publishDate: formData.publishDate,
      schedulePublish: formData.status === "scheduled",
      id: `${Date.now()}`,
      author: "관리자",
      createdAt: new Date().toISOString(),
      views: 0
    }
    onCreate(newNotice)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm bg-content-light dark:bg-content-dark" aria-describedby="notice-modal-description">
        <DialogDescription className="sr-only">
          이 대화 상자는 새 공지사항을 작성하고 게시 일정을 설정하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>새 공지사항 등록</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="공지사항 제목을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>카테고리</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">시스템</SelectItem>
                  <SelectItem value="maintenance">점검</SelectItem>
                  <SelectItem value="update">업데이트</SelectItem>
                  <SelectItem value="event">이벤트</SelectItem>
                  <SelectItem value="policy">정책</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="공지사항 내용을 입력하세요"
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>우선순위</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as "low" | "medium" | "high" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">일반</SelectItem>
                  <SelectItem value="medium">중요</SelectItem>
                  <SelectItem value="high">긴급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>게시 상태</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="published" id="published" />
                  <Label htmlFor="published">즉시 게시</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="draft" id="draft" />
                  <Label htmlFor="draft">임시저장</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled">예약 게시</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {formData.status === "scheduled" && (
            <div className="space-y-2">
              <Label>게시 예약 날짜</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.publishDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.publishDate ? format(formData.publishDate, "yyyy년 MM월 dd일") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-content-light dark:bg-content-dark">
                  <Calendar
                    mode="single"
                    selected={formData.publishDate}
                    onSelect={(date) => {
                      if (date) {
                        setFormData({ ...formData, publishDate: date })
                        setDatePickerOpen(false)
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">{formData.status === "published" ? "게시하기" : "저장하기"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
