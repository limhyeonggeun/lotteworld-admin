"use client"

import { Eye, RefreshCcw, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"

interface Reservation {
  bookingNo: string
  buyerName: string
  optionName: string
  visitDate: string
  payMethod: string
  price: number
  status: string
  createdAt: string
  User: {
    id: number
    name: string
    email: string
  }
}

interface Props {
  reservations: Reservation[]
  onView: (reservation: Reservation) => void
  onChangeStatus: (reservation: Reservation) => void
  onRefund: (reservation: Reservation) => void
  userRole: string
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function ReservationTable({
  reservations,
  onView,
  onChangeStatus,
  onRefund,
  userRole,
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "예매완료":
        return <Badge className="bg-blue-100 text-blue-800">예매완료</Badge>
      case "사용완료":
        return <Badge className="bg-green-100 text-green-800">사용완료</Badge>
      case "취소완료":
        return <Badge className="bg-red-100 text-red-800">취소완료</Badge>
      case "사용불가":
        return <Badge className="bg-gray-200 text-gray-600">사용불가</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">예매 번호</TableHead>
              <TableHead className="text-center">주문자</TableHead>
              <TableHead className="text-center">티켓</TableHead>
              <TableHead className="text-center">방문일</TableHead>
              <TableHead className="text-center">구매일</TableHead>
              <TableHead className="text-center">결제수단</TableHead>
              <TableHead className="text-center">결제금액</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center no-print">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res.bookingNo} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                <TableCell className="text-center font-medium">{res.bookingNo}</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col">
                    <span className="font-medium">{res.User?.name ?? res.buyerName}</span>
                    <span className="text-xs text-gray-500">{res.User?.email}</span>
                    <span className="text-xs text-gray-500">ID: {res.User?.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{res.optionName}</TableCell>
                <TableCell className="text-center">{res.visitDate}</TableCell>
                <TableCell className="text-center text-sm text-gray-600">
                  {res.createdAt ? res.createdAt.split("T")[0] : "-"}
                </TableCell>
                <TableCell className="text-center">{res.payMethod}</TableCell>
                <TableCell className="text-center">{res.price.toLocaleString()}원</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">{getStatusBadge(res.status)}</div>
                </TableCell>
                <TableCell className="text-center no-print">
                  <div className="flex justify-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => onView(res)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onChangeStatus(res)}>
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={ 
                        userRole !== "superadmin" && res.status === "사용완료"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                      onClick={() => {
                        if (userRole === "superadmin" || res.status !== "사용완료") {
                          onRefund(res)
                        }
                      }}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-4 space-x-2 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant="outline"
              size="sm"
              className={currentPage === i + 1 ? "bg-blue-50 text-blue-600" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}