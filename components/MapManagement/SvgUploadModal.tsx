"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileImage } from "lucide-react"

interface SVGUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (svgContent: string) => void
}

export function SVGUploadModal({ isOpen, onClose, onUpload }: SVGUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "image/svg+xml") {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setPreview(content)
      }
      reader.readAsText(file)
    } else {
      alert("SVG 파일만 업로드 가능합니다.")
    }
  }

  const handleUpload = () => {
    if (preview) {
      onUpload(preview)
      setSelectedFile(null)
      setPreview("")
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogDescription className="sr-only">
          이 대화 상자는 지도 SVG 파일을 업로드하는 데 사용됩니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>지도 SVG 업로드</DialogTitle>
        </DialogHeader>
        

        <div className="space-y-4">
          <div>
            <Label htmlFor="svg_file">SVG 파일 선택</Label>
            <Input id="svg_file" type="file" accept=".svg" onChange={handleFileSelect} className="cursor-pointer" />
          </div>

          {preview && (
            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              </div>
            </div>
          )}

          {!selectedFile && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">SVG 파일을 선택하여 테마파크 지도를 업로드하세요</p>
              <p className="text-sm text-gray-500 mt-2">권장 크기: 800x600px 이상</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button onClick={handleUpload} disabled={!preview} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              업로드
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
