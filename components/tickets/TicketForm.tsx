"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import BasicTicketInfoForm from "./BasicTicketInfoForm"
import BenefitOptionsForm from "./BenefitOptionsForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface MaxCount {
  adult: number
  teen: number
  child: number
}

interface BenefitOption {
  optionName: string
  benefit: string
  basePriceAdult: number
  basePriceTeen: number
  basePriceChild: number
  discountPercentAdult: number
  discountPercentTeen: number
  discountPercentChild: number
  detailText: string
  maxCount: MaxCount
}

interface BenefitData {
  cardName: string
  category: string
  description: string
  options: BenefitOption[]
}

interface Ticket {
  id: number
  title: string
}

interface TicketFormProps {
  mode: "new" | "existing"
}

export default function TicketForm({ mode }: TicketFormProps) {
  const [ticketList, setTicketList] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null)

  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    price: "",
    category: "제휴 할인",
    image: null as File | null,
  })

  const [benefitData, setBenefitData] = useState<BenefitData>({
    cardName: "",
    category: "",
    description: "",
    options: [],
  })

  useEffect(() => {
    api.get("/api/tickets")
      .then(res => {
        setTicketList(res.data)
        if (res.data.length > 0) setSelectedTicketId(res.data[0].id)
      })
      .catch(err => console.error("티켓 목록 로드 실패", err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let ticketId = selectedTicketId

    try {
      if (mode === "new") {
        const formData = new FormData()
        formData.append("title", ticketData.title)
        formData.append("description", ticketData.description)
        formData.append("price", ticketData.price)
        formData.append("category", ticketData.category)
        if (ticketData.image) formData.append("image", ticketData.image)

        const ticketRes = await api.post("/api/tickets", formData)
        ticketId = ticketRes.data.id
      }

      if (!ticketId) {
        alert("티켓이 선택되지 않았습니다.")
        return
      }

      await api.post("/api/benefits", {
        ...benefitData,
        ticketId,
      })

      alert("티켓과 혜택이 모두 등록되었습니다.")

      setTicketData({
        title: "",
        description: "",
        price: "",
        category: "제휴 할인",
        image: null,
      })

      setBenefitData({
        cardName: "",
        category: "",
        description: "",
        options: [],
      })

    } catch (err) {
      console.error("등록 오류:", err)
      alert("등록 중 오류가 발생했습니다.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {mode === "new" ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">티켓 기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <BasicTicketInfoForm data={ticketData} setData={setTicketData} />
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">티켓 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>등록할 혜택을 연결할 티켓</Label>
            <select
              value={selectedTicketId ?? ""}
              onChange={(e) => setSelectedTicketId(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            >
              {ticketList.map(ticket => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.title}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">혜택 옵션 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <BenefitOptionsForm data={benefitData} setData={setBenefitData} />
        </CardContent>
      </Card>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded text-base font-semibold"
        >
          등록하기
        </button>
      </div>
    </form>
  )
}