"use client"

import React, { useEffect, useState } from "react"
import Layout from "@/components/layout/Layout"
import MaintenanceForm from "@/components/maintenance/MaintenanceForm"
import MaintenanceList from "@/components/maintenance/MaintenanceList"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import api from "@/lib/axios"

interface MaintenanceItem {
  id: number
  label: string
  reason: string
  imageUrl: string
  date: string
}

export default function MaintenancePage() {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const fetchMaintenance = async () => {
    try {
      const res = await api.get("/api/maintenance")
      setMaintenanceItems(res.data)
    } catch (err) {
      console.error("불러오기 실패:", err)
    }
  }

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const handleRegister = () => {
    fetchMaintenance()
  }

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          api.delete(`/api/maintenance/${id}`)
        )
      )
      alert("삭제되었습니다.")
      setSelectedItems([])
      fetchMaintenance()
    } catch (err) {
      console.error("삭제 실패:", err)
      alert("삭제 실패")
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredAndSortedItems = maintenanceItems
    .filter((item) => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0, 0, 0, 0)
      return itemDate >= today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const groupedItems: Record<string, MaintenanceItem[]> = paginatedItems.reduce(
    (acc, item) => {
      const formattedDate = format(new Date(item.date), "yyyy년 MM월 dd일", { locale: ko })
      if (!acc[formattedDate]) acc[formattedDate] = []
      acc[formattedDate].push(item)
      return acc
    },
    {} as Record<string, MaintenanceItem[]>
  )

  const groupedArray: [string, MaintenanceItem[]][] = Object.entries(groupedItems)
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage)

  return (
    <Layout title="시스템 관리">
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-3">
          <div>
            <h1 className="text-2xl font-bold">운휴 정보 등록</h1>
            <p className="text-sm text-gray-500">
              놀이기구, 시설 등의 운휴 정보를 등록하고 관리할 수 있습니다.
            </p>
          </div>
        </div>

        <MaintenanceForm onRegister={handleRegister} />
        <MaintenanceList
          groupedItems={groupedArray}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          selectedItems={selectedItems}
          toggleSelect={toggleSelect}
          handleDelete={handleDelete}
        />
      </div>
    </Layout>
  )
}