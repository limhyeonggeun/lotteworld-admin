

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { FAQ } from "@/lib/noticesfaqdata"
import { faqCategories } from "@/lib/noticesfaqdata"

interface EditFAQModalProps {
  isOpen: boolean
  onClose: () => void
  faq: FAQ | null
  onUpdate: (updated: FAQ) => void
}

export function EditFAQModal({ isOpen, onClose, faq, onUpdate }: EditFAQModalProps) {
  const [formData, setFormData] = useState<FAQ | null>(faq)

  useEffect(() => {
    setFormData(faq)
  }, [faq])

  if (!formData) return null

  const handleChange = (field: keyof FAQ, value: string) => {
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
      <DialogContent className="max-w-sm" aria-describedby="edit-faq-description">
        <DialogDescription className="sr-only">
          이 대화 상자는 FAQ의 내용을 수정하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>FAQ 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="질문"
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
          />
          <Textarea
            className="min-h-[200px]"
            placeholder="답변"
            value={formData.answer}
            onChange={(e) => handleChange("answer", e.target.value)}
          />
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {faqCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
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