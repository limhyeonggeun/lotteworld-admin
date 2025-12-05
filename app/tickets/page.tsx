"use client"

import { useState, useEffect } from "react"
import { Download, Printer } from "lucide-react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import ViewReservationModal from "@/components/reservations/ReservationDetailModal"
import ReservationTable from "@/components/reservations/ReservationTable"
import ReservationFilters from "@/components/reservations/ReservationFilters"
import ChangeReservationStatusModal from "@/components/reservations/ChangeReservationStatusModal"
import RefundModal from "@/components/reservations/RefundModal"
import Layout from "@/components/layout/Layout"
import api from "@/lib/axios"

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("전체 상태")
  const [ticketTypeFilter, setTicketTypeFilter] = useState("전체")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const reservationsPerPage = 10

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/api/orders")
        const mapped = res.data.map((item: any) => ({
          id: item.id,
          bookingNo: item.bookingNo,
          buyerName: item.buyerName,
          buyerEmail: item.buyerEmail,
          buyerPhone: item.buyerPhone,
          visitorName: item.visitorName,
          visitorEmail: item.visitorEmail,
          visitorPhone: item.visitorPhone,
          userId: item.userId,
          quantity: item.quantity,
          price: item.price,
          payMethod: item.payMethod,
          optionName: item.optionName,
          visitDate: item.visitDate,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          status: item.status,
          counts: item.counts,
          Ticket: item.Ticket,
          User: item.User,
          paymentAmount: item.price,
        }))
        setReservations(mapped)
      } catch (err) {
        console.error("예약 불러오기 실패", err)
      }
    }

    fetchReservations()
  }, [])

  const handleViewReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setIsViewModalOpen(true)
  }

  const handleRefundReservation = (reservation: any) => {
    setSelectedReservation(reservation)
    setIsRefundModalOpen(true)
  }

  const handleExport = () => {
    const exportData = filteredReservations.map((r) => ({
      예매번호: r.bookingNo,
      주문자: r.buyerName,
      이메일: r.buyerEmail,
      전화번호: r.buyerPhone,
      티켓유형: r.optionName,
      결제금액: r.price,
      결제수단: r.payMethod,
      상태: r.status,
      방문일: r.visitDate,
      구매일: r.createdAt,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations")

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    })

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    })

    saveAs(blob, `reservations_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.bookingNo.includes(searchQuery) ||
      r.buyerName.includes(searchQuery) ||
      r.User?.email.includes(searchQuery)

    const matchesStatus =
      statusFilter === "전체 상태" || r.status === statusFilter

    const matchesTicket =
      ticketTypeFilter === "전체" || r.optionName === ticketTypeFilter

    const matchesDate =
      !dateRange?.from ||
      !dateRange?.to ||
      (new Date(r.visitDate) >= dateRange.from &&
        new Date(r.visitDate) <= dateRange.to)

    return (
      matchesSearch &&
      matchesStatus &&
      matchesTicket &&
      matchesDate
    )
  })

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage)
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * reservationsPerPage,
    currentPage * reservationsPerPage
  )

  return (
    <Layout title="티켓 예매 관리">
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-3 no-print">
          <div>
            <h1 className="text-2xl font-bold">예매 목록</h1>
            <p className="text-sm text-gray-500">전체 예매 내역을 관리할 수 있습니다.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm px-3" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" /> 내보내기
            </Button>
            <Button variant="outline" className="text-sm px-3" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> 인쇄
            </Button>
          </div>
        </div>

        <div className="no-print">
          <ReservationFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            ticketTypeFilter={ticketTypeFilter}
            setTicketTypeFilter={setTicketTypeFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>

        <Card>
          <CardHeader className="no-print">
            <CardTitle>예매 목록 ({filteredReservations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="print-area">
              <ReservationTable
                reservations={paginatedReservations}
                onView={handleViewReservation}
                onChangeStatus={(res) => {
                  setSelectedReservation(res)
                  setIsStatusModalOpen(true)
                }}
                onRefund={handleRefundReservation}
                userRole="admin"
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>

        <ViewReservationModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          reservation={selectedReservation}
          userRole="admin"
        />

        <ChangeReservationStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          reservation={selectedReservation}
          onSubmit={(status, notes) => {
            setReservations((prev) =>
              prev.map((res) =>
                res.bookingNo === selectedReservation.bookingNo
                  ? { ...res, status, notes }
                  : res
              )
            )
            setIsStatusModalOpen(false)
          }}
        />

        <RefundModal
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          reservation={selectedReservation}
          onRefund={async (bookingId) => {
            try {
              await api.patch(`/api/orders/${bookingId}`, {
                status: "취소완료",
              });
          
              setReservations((prev) =>
                prev.map((res) =>
                  res.id === bookingId ? { ...res, status: "취소완료" } : res
                )
              );
          
              alert("환불이 완료되었습니다.");
            } catch (err) {
              console.error("환불 실패:", err);
              alert("환불 처리 중 오류가 발생했습니다.");
            }
          }}
        />
      </div>
    </Layout>
  )
}