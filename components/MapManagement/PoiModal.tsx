"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MapPicker } from "@/components/poi/MapPicker"
import type { POI } from "@/lib/PoiData"
import type { Category } from "@/lib/CategoryData"

interface POIModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (poi: POI | Omit<POI, "id">) => void
  editingPOI?: POI | null
  categories: Category[]
}

export function POIModal({ isOpen, onClose, onSubmit, editingPOI, categories }: POIModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location_x: 50,
    location_y: 50,
    open_time: "09:00",
    close_time: "22:00",
    is_open: true,
    thumbnail: "",
  })

  useEffect(() => {
    if (editingPOI) {
      setFormData({
        name: editingPOI.name,
        description: editingPOI.description,
        category: editingPOI.category,
        location_x: editingPOI.location_x,
        location_y: editingPOI.location_y,
        open_time: editingPOI.open_time,
        close_time: editingPOI.close_time,
        is_open: editingPOI.is_open,
        thumbnail: editingPOI.thumbnail || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        location_x: 50,
        location_y: 50,
        open_time: "09:00",
        close_time: "22:00",
        is_open: true,
        thumbnail: "",
      })
    }
  }, [editingPOI, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPOI) {
      onSubmit({ ...formData, id: editingPOI.id })
    } else {
      onSubmit(formData)
    }
  }

  const handleMapClick = (x: number, y: number) => {
    setFormData((prev) => ({
      ...prev,
      location_x: x,
      location_y: y,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-content-light dark:bg-content-dark">
        <DialogHeader>
          <DialogTitle>{editingPOI ? "POI 편집" : "새 POI 추가"}</DialogTitle>
          <DialogDescription className="sr-only">
            {editingPOI ? "POI 정보를 수정하는 대화 상자입니다." : "새 POI를 추가하는 대화 상자입니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">POI 이름</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="POI 이름을 입력하세요"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="POI에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location_x">X 좌표</Label>
                  <Input
                    id="location_x"
                    type="number"
                    step="0.1"
                    value={formData.location_x}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location_x: Number.parseFloat(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location_y">Y 좌표</Label>
                  <Input
                    id="location_y"
                    type="number"
                    step="0.1"
                    value={formData.location_y}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location_y: Number.parseFloat(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="open_time">오픈 시간</Label>
                  <Input
                    id="open_time"
                    type="time"
                    value={formData.open_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, open_time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="close_time">마감 시간</Label>
                  <Input
                    id="close_time"
                    type="time"
                    value={formData.close_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, close_time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_open"
                  checked={formData.is_open}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_open: checked }))}
                />
                <Label htmlFor="is_open">현재 운영중</Label>
              </div>

              <div>
                <Label htmlFor="thumbnail">썸네일 이미지</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {formData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail || "/placeholder.svg"}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Map Picker */}
            <div>
              <Label>지도에서 위치 선택</Label>
              <MapPicker selectedX={formData.location_x} selectedY={formData.location_y} onMapClick={handleMapClick} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingPOI ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
