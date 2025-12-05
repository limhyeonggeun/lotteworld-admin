"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import type { Route } from "@/lib/RouteData"
import type { POI } from "@/lib/PoiData"

interface RouteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (route: Route | Omit<Route, "id">) => void
  editingRoute?: Route | null
  pois: POI[]
}

export function RouteModal({ isOpen, onClose, onSubmit, editingRoute, pois }: RouteModalProps) {
  const [formData, setFormData] = useState({
    start_poi: "",
    end_poi: "",
    svg_path_url: "",
  })

  useEffect(() => {
    if (editingRoute) {
      setFormData({
        start_poi: editingRoute.start_poi,
        end_poi: editingRoute.end_poi,
        svg_path_url: editingRoute.svg_path_url,
      })
    } else {
      setFormData({
        start_poi: "",
        end_poi: "",
        svg_path_url: "",
      })
    }
  }, [editingRoute, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRoute) {
      onSubmit({ ...formData, id: editingRoute.id })
    } else {
      onSubmit(formData)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      const mockUrl = `/uploads/routes/${file.name}`
      setFormData((prev) => ({
        ...prev,
        svg_path_url: mockUrl,
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogDescription className="sr-only">
          이 대화 상자는 경로 정보를 추가하거나 수정하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>{editingRoute ? "경로 편집" : "새 경로 추가"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="start_poi">시작점</Label>
            <Select
              value={formData.start_poi}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, start_poi: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="시작점을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {pois.map((poi) => (
                  <SelectItem key={poi.id} value={poi.name}>
                    {poi.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="end_poi">도착점</Label>
            <Select
              value={formData.end_poi}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, end_poi: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="도착점을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {pois.map((poi) => (
                  <SelectItem key={poi.id} value={poi.name}>
                    {poi.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="svg_file">SVG 파일 업로드</Label>
            <div className="mt-1">
              <Input id="svg_file" type="file" accept=".svg" onChange={handleFileUpload} className="cursor-pointer" />
            </div>
            {formData.svg_path_url && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                <Upload className="w-4 h-4" />
                <span>파일 업로드됨: {formData.svg_path_url}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingRoute ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
