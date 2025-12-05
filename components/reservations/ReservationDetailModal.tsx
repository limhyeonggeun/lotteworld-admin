"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import dayjs from "dayjs"

interface Props {
  isOpen: boolean
  onClose: () => void
  reservation: any
  userRole: string
}


export default function ViewReservationModal({ isOpen, onClose, reservation, userRole }: Props) {
  const formatDate = (dateStr: string) => {
    return dateStr ? dayjs(dateStr).format("YYYY.MM.DD HH:mm") : "정보 없음"
  }

  const formatCounts = (counts: any) => {
    if (!counts) return "정보 없음"
  
    let parsed
    try {
      parsed = typeof counts === "string" ? JSON.parse(counts) : counts
    } catch (e) {
      return "정보 없음"
    }
  
    const { adult = 0, teen = 0, child = 0 } = parsed
    return `어른 ${adult}, 청소년 ${teen}, 어린이 ${child}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="bg-content-light dark:bg-content-dark text-gray-900 dark:text-white">
        <DialogDescription className="sr-only">
          예매에 대한 전체 정보를 확인할 수 있습니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>예매 상세정보</DialogTitle>
        </DialogHeader>

        {reservation && (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3 mt-4">
              <TabsTrigger value="details">예매 정보</TabsTrigger>
              <TabsTrigger value="payment">결제 정보</TabsTrigger>
              <TabsTrigger value="history">상태 이력</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "예매 ID", value: reservation.bookingNo },
                  { label: "회원 이름", value: reservation.buyerName },
                  { label: "회원 ID", value: reservation.userId },
                  { label: "이메일", value: reservation.buyerEmail },
                  { label: "티켓 종류", value: reservation.optionName },
                  { label: "수량", value: reservation.quantity },
                  { label: "인원 구성", value: formatCounts(reservation.counts) },
                  { label: "방문일", value: formatDate(reservation.visitDate) },
                  { label: "상태", value: reservation.status },
                  { label: "구매일", value: formatDate(reservation.createdAt) },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      {item.label}
                    </p>
                    <p className="mt-1 ml-1 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "결제 금액", value: `${reservation.price?.toLocaleString()}원` },
                  { label: "결제 수단", value: reservation.payMethod },
                  { label: "구매일", value: formatDate(reservation.createdAt) },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="inline-block text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      {item.label}
                    </p>
                    <p className="mt-1 ml-1 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 text-xs">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-500">{formatDate(reservation.createdAt)} - System</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 text-xs">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Confirmed</p>
                    <p className="text-xs text-gray-500">{formatDate(reservation.createdAt)} - System</p>
                  </div>
                </div>

                {reservation.status === "사용완료" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-800 text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-gray-500">{formatDate(reservation.visitDate)} - System</p>
                      </div>
                    </div>
                  </>
                )}

                {reservation.status === "환불완료" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-800 text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cancelled</p>
                        <p className="text-xs text-gray-500">{formatDate(reservation.updatedAt)} - Admin</p>
                      </div>
                    </div>
                  </>
                )}

                {reservation.status === "사용불가" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-700 text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Expired</p>
                        <p className="text-xs text-gray-500">{formatDate(reservation.updatedAt)} - System</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}