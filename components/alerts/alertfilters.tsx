"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface AlertFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  recipientFilter: string
  setRecipientFilter: (recipient: string) => void
  methodFilter: string
  setMethodFilter: (method: string) => void
}

export function AlertFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  recipientFilter,
  setRecipientFilter,
  methodFilter,
  setMethodFilter,
}: AlertFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          필터 및 검색
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="제목 또는 내용으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="scheduled">예약됨</SelectItem>
              <SelectItem value="sent">전송됨</SelectItem>
              <SelectItem value="failed">실패</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recipientFilter} onValueChange={setRecipientFilter}>
            <SelectTrigger>
              <SelectValue placeholder="수신자" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 수신자</SelectItem>
              <SelectItem value="all_users">전체 사용자</SelectItem>
              <SelectItem value="specific">특정 사용자</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="전송 방법" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 방법</SelectItem>
              <SelectItem value="push">푸시 알림</SelectItem>
              <SelectItem value="email">이메일</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
