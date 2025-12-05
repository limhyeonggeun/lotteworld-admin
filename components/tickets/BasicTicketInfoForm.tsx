"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface BasicTicketInfoFormProps {
  data: {
    title: string
    description: string
    price: string
    category: string
    image: File | null
  }
  setData: React.Dispatch<React.SetStateAction<{
    title: string
    description: string
    price: string
    category: string
    image: File | null
  }>>
}

export default function BasicTicketInfoForm({
  data,
  setData,
}: BasicTicketInfoFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label>티켓 제목</Label>
        <Input
          value={data.title}
          onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="혜택 이름을 입력하세요"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>설명</Label>
        <Textarea
          value={data.description}
          onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="혜택 설명을 입력하세요"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>가격</Label>
        <Input
          type="number"
          value={data.price}
          onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
          placeholder="가격을 입력하세요"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>카테고리</Label>
        <Select value={data.category} onValueChange={(value) => setData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="제휴 할인">제휴 할인</SelectItem>
            <SelectItem value="이달의 할인">이달의 할인</SelectItem>
            <SelectItem value="매직패스">매직패스</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>이미지</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setData(prev => ({ ...prev, image: file }))
          }}
        />
      </div>
    </div>
  )
}