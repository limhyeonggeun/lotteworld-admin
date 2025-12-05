"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  userRole: string;
}

export default function ViewReservationModal({ isOpen, onClose, reservation, userRole }: Props) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed": return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
      case "Completed": return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "Cancelled": return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogDescription className="sr-only">
          예매에 대한 전체 정보를 확인할 수 있습니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>예매 상세정보</DialogTitle>
        </DialogHeader>
        {reservation && (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">예매 정보</TabsTrigger>
              <TabsTrigger value="payment">결제 정보</TabsTrigger>
              <TabsTrigger value="history">상태 이력</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "예매 ID", value: reservation.id },
                  { label: "회원 이름", value: reservation.memberName },
                  { label: "회원 ID", value: reservation.memberId },
                  { label: "이메일", value: reservation.email },
                  { label: "티켓 종류", value: reservation.ticketType },
                  { label: "수량", value: reservation.quantity },
                  { label: "예매 시간", value: reservation.reservationTime },
                  { label: "상태", value: <div>{getStatusBadge(reservation.status)}</div> },
                  { label: "구매일", value: reservation.purchaseDate },
                  { label: "추가 정보", value: reservation.additionalInfo || "없음" },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="text-sm text-gray-500">{item.label}</Label>
                    <div className="text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "결제 금액", value: `${reservation.paymentAmount.toLocaleString()}원` },
                  { label: "결제 수단", value: reservation.paymentMethod },
                  { label: "거래 ID", value: reservation.transactionId },
                  { label: "구매일", value: reservation.purchaseDate },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="text-sm text-gray-500">{item.label}</Label>
                    <div className="text-sm">{item.value}</div>
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
                    <p className="text-xs text-gray-500">{reservation.purchaseDate} - System</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 text-xs">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Confirmed</p>
                    <p className="text-xs text-gray-500">{reservation.purchaseDate} - System</p>
                  </div>
                </div>
                {reservation.status === "Completed" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-800 text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-gray-500">{reservation.reservationDate} - System</p>
                      </div>
                    </div>
                  </>
                )}
                {reservation.status === "Cancelled" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-800 text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cancelled</p>
                        <p className="text-xs text-gray-500">{reservation.reservationDate} - Admin</p>
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
  );
}