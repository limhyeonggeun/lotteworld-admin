"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Category } from "@/lib/CategoryData"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (category: Category | Omit<Category, "id">) => void
  editingCategory?: Category | null
}

export function CategoryModal({ isOpen, onClose, onSubmit, editingCategory }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
  })

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        icon: editingCategory.icon || "",
      })
    } else {
      setFormData({
        name: "",
        icon: "",
      })
    }
  }, [editingCategory, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      onSubmit({ ...formData, id: editingCategory.id })
    } else {
      onSubmit(formData)
    }
  }

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          icon: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogDescription className="sr-only">
          이 대화 상자는 카테고리 정보를 추가하거나 수정하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>{editingCategory ? "카테고리 편집" : "새 카테고리 추가"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">카테고리 이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="카테고리 이름을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="icon">아이콘 업로드</Label>
            <Input id="icon" type="file" accept="image/*" onChange={handleIconUpload} className="cursor-pointer" />
            {formData.icon && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={formData.icon || "/placeholder.svg"} alt="Preview" className="w-8 h-8 object-contain" />
                <span className="text-sm text-gray-600">아이콘 미리보기</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {editingCategory ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
