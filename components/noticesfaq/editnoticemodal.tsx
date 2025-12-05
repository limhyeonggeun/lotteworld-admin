"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Notice } from "@/lib/noticesfaqdata"

interface EditNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  notice: Notice | null
  onUpdate: (updated: Notice) => void
}

export function EditNoticeModal({ isOpen, onClose, notice, onUpdate }: EditNoticeModalProps) {
  const [formData, setFormData] = useState(notice)

  useEffect(() => {
    setFormData(notice)
  }, [notice])

  if (!formData) return null

  const handleChange = (field: keyof Notice, value: string) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  const handleSubmit = () => {
    if (formData) {
      onUpdate(formData)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm" aria-describedby="edit-notice-description">
        <DialogDescription className="sr-only">
          이 대화 상자는 기존 공지사항의 내용을 수정하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>공지사항 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <Textarea
            className="min-h-[200px]"
            placeholder="내용"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
          />
          <Input
            placeholder="카테고리"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="상태 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">게시됨</SelectItem>
              <SelectItem value="draft">임시저장</SelectItem>
              <SelectItem value="scheduled">예약됨</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}