import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/date-range-picker"
import api from "@/lib/axios"

interface Props {
  onRegister: () => void
}

export default function MaintenanceForm({ onRegister }: Props) {
  const [label, setLabel] = useState("")
  const [reason, setReason] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const getDateRangeArray = (from: Date, to: Date) => {
    const dates: string[] = []
    const current = new Date(from)
    while (current <= to) {
      dates.push(current.toISOString().split("T")[0])
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dateRange?.from || !dateRange?.to || !image) return

    const dates = getDateRangeArray(dateRange.from, dateRange.to)

    try {
      const formData = new FormData()
      formData.append("label", label)
      formData.append("reason", reason)
      formData.append("image", image)
      formData.append("date", dates[0])

      const firstRes = await api.post("/api/maintenance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const uploadedImageUrl = firstRes.data.imageUrl

      await Promise.all(
        dates.slice(1).map((date) =>
          api.post("/api/maintenance", {
            label,
            reason,
            date,
            imageUrl: uploadedImageUrl,
          })
        )
      )

      alert("운휴 정보가 등록되었습니다.")
      setLabel("")
      setReason("")
      setImage(null)
      setDateRange(undefined)
      onRegister()
    } catch (err) {
      console.error("운휴 등록 실패:", err)
      alert("등록에 실패했습니다.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3"
    >
      <div className="grid gap-2">
        <Label className="text-sm">운휴 어트랙션 이름</Label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className="h-8 text-sm"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-sm">운휴 사유</Label>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="h-8 text-sm"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-sm">운휴 기간</Label>
        <DatePickerWithRange
          date={dateRange}
          onChange={setDateRange}
          numberOfMonths={1}
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-sm">이미지</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
          className="h-8 text-sm"
        />
      </div>

      <Button type="submit" className="h-8 px-3 text-sm">
        등록하기
      </Button>
    </form>
  )
}