"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { faqCategories } from "@/lib/noticesfaqdata"
import type { FAQ } from "@/lib/noticesfaqdata"

interface CreateFAQModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newFAQ: FAQ) => void
}

export function CreateFAQModal({ isOpen, onClose, onCreate }: CreateFAQModalProps) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const newFAQ: FAQ = {
      id: `FAQ-${Date.now()}`,
      views: 0,
      order: Date.now(),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
    }
    onCreate(newFAQ)
    onClose()
    setFormData({ question: "", answer: "", category: "general" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm bg-white dark:bg-muted p-6 rounded-lg shadow-lg" aria-describedby="create-faq-description">
        <DialogDescription className="sr-only">
          이 대화 상자는 새 FAQ 항목을 입력하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>FAQ 생성</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="질문을 입력하세요"
            className="text-sm font-normal"
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
          />
          <Textarea
            placeholder="답변을 입력하세요"
            className="min-h-[160px] text-sm font-normal"
            value={formData.answer}
            onChange={(e) => handleChange("answer", e.target.value)}
          />
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className="w-full">
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