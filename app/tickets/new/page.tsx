"use client"

import React, { useState } from "react"
import Layout from "@/components/layout/Layout"
import TicketForm from "@/components/tickets/TicketForm"

export default function NewTicketPage() {
  const [mode, setMode] = useState<"new" | "existing">("new")

  return (
    <Layout title="티켓예매관리">
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-3">
          <div>
            <h1 className="text-2xl font-bold">티켓 등록</h1>
            <p className="text-sm text-gray-500">신규 티켓 정보를 등록할 수 있습니다.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("new")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition border shadow-sm
                ${mode === "new" ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              새 티켓 등록
            </button>
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition border shadow-sm
                ${mode === "existing" ? "bg-primary text-white border-primary" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
            >
              기존 티켓 선택
            </button>
          </div>
        </div>

        <TicketForm mode={mode} />
      </div>
    </Layout>
  )
}