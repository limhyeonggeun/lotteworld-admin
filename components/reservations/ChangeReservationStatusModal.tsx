import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface Props {
  isOpen: boolean
  onClose: () => void
  reservation: any
  onSubmit: (status: string, notes: string) => void
}

export default function ChangeReservationStatusModal({ isOpen, onClose, reservation, onSubmit }: Props) {
  const [status, setStatus] = useState(reservation?.status || "")
  const [notes, setNotes] = useState("")

  const handleStatusChange = async () => {
    try {
      await api.patch(`/api/orders/${reservation.id}`, {
        status,
        notes,
      })
      onSubmit(status, notes)
    } catch (err) {
      console.error("상태 변경 실패", err)
      alert("상태 변경 중 오류가 발생했습니다.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md bg-white rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">예매 상태 변경</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">새로운 상태</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                id="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-left font-normal focus:outline-none focus:ring-2 focus:ring-black"
              >
                <SelectValue placeholder="상태 선택" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="w-full rounded-md border border-gray-200 shadow-md">
                <SelectItem value="예매완료" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">예매완료</SelectItem>
                <SelectItem value="사용완료" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">사용완료</SelectItem>
                <SelectItem value="취소완료" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">취소완료</SelectItem>
                <SelectItem value="사용불가" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">사용불가</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">비고 (선택)</Label>
            <Textarea
              id="notes"
              placeholder="상태 변경에 대한 메모를 입력하세요."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] border-gray-300 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="pt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button className="bg-black text-white hover:bg-black/90" onClick={handleStatusChange}>
            상태 업데이트
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}